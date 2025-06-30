// --- MAPS AND DEFINITIONS ---
const periciasBase = [
    { nome: 'Acrobacia', attr: 'des' }, { nome: 'Adestramento', attr: 'car' }, { nome: 'Atletismo', attr: 'for' },
    { nome: 'Atuação', attr: 'car' }, { nome: 'Cavalgar', attr: 'des' }, { nome: 'Conhecimento', attr: 'int' },
    { nome: 'Cura', attr: 'sab' }, { nome: 'Diplomacia', attr: 'car' }, { nome: 'Enganação', attr: 'car' },
    { nome: 'Fortitude', attr: 'con' }, { nome: 'Furtividade', attr: 'des' }, { nome: 'Guerra', attr: 'int' },
    { nome: 'Iniciativa', attr: 'des' }, { nome: 'Intimidação', attr: 'car' }, { nome: 'Intuição', attr: 'sab' },
    { nome: 'Investigação', attr: 'int' }, { nome: 'Jogatina', attr: 'car' }, { nome: 'Ladinagem', attr: 'des' },
    { nome: 'Luta', attr: 'for' }, { nome: 'Misticismo', attr: 'int' }, { nome: 'Nobreza', attr: 'int' },
    { nome: 'Ofício', attr: 'int' }, { nome: 'Percepção', attr: 'sab' }, { nome: 'Pilotagem', attr: 'des' },
    { nome: 'Pontaria', attr: 'des' }, { nome: 'Reflexos', attr: 'des' }, { nome: 'Religião', attr: 'sab' },
    { nome: 'Sobrevivência', attr: 'sab' }, { nome: 'Vontade', attr: 'sab' }
];
const attrMap = { 'for': 'forca', 'des': 'destreza', 'con': 'constituicao', 'int': 'inteligencia', 'sab': 'sabedoria', 'car': 'carisma' };

// --- CALCULATION AND UPDATE FUNCTIONS ---
function calcularModificador(valor) { return Math.floor((valor - 10) / 2); }

function atualizarTotaisPericias() {
    periciasBase.forEach(pericia => {
        const pId = pericia.nome.toLowerCase().replace(/\s/g, '-');
        const totalSpan = document.getElementById(`total-${pId}`);
        const bonusAttrSpan = document.getElementById(`bonus-${pId}`);
        const treinoInput = document.getElementById(`treino-${pId}`);
        const outrosInput = document.getElementById(`outros-${pId}`);
        const modAttrSpan = document.getElementById(`mod-${attrMap[pericia.attr]}`);

        if (totalSpan && treinoInput && outrosInput && modAttrSpan && bonusAttrSpan) {
            const modAttr = parseInt(modAttrSpan.textContent || '0') || 0;
            const treinoVal = parseInt(treinoInput.value) || 0;
            const outros = parseInt(outrosInput.value) || 0;
            
            bonusAttrSpan.textContent = modAttr >= 0 ? `+${modAttr}` : `${modAttr}`;
            const total = modAttr + treinoVal + outros;
            totalSpan.textContent = total >= 0 ? `+${total}` : `${total}`;
        }
    });
}

function atualizarModificadores() {
    document.querySelectorAll('.attribute-node').forEach(node => {
        const input = node.querySelector('input[type="number"]');
        const modDisplay = node.querySelector('.modificador');
        if (input && modDisplay) {
            const mod = calcularModificador(parseInt(input.value) || 10);
            modDisplay.textContent = mod >= 0 ? `+${mod}` : `${mod}`;
        }
    });
    atualizarTotaisPericias();
    atualizarCarga();
}

function atualizarBarrasStatus() {
    const pvAtuais = parseInt(document.getElementById('pv_atuais').value) || 0;
    const pvMax = parseInt(document.getElementById('pv_max').value) || 1;
    const pmAtuais = parseInt(document.getElementById('pm_atuais').value) || 0;
    const pmMax = parseInt(document.getElementById('pm_max').value) || 1;

    const pvPercent = Math.max(0, Math.min(100, (pvAtuais / pvMax) * 100));
    const pmPercent = Math.max(0, Math.min(100, (pmAtuais / pmMax) * 100));

    document.getElementById('pv-fill').style.width = `${pvPercent}%`;
    document.getElementById('pm-fill').style.width = `${pmPercent}%`;
}

function atualizarBarraXP() {
    const xpAtuaisInput = document.getElementById('xp_atual');
    const xpProxNivelInput = document.getElementById('xp_prox_nivel');
    const nivelInput = document.getElementById('nivel');
    
    if (!xpAtuaisInput || !xpProxNivelInput || !nivelInput) return;

    let xpAtuais = parseInt(xpAtuaisInput.value) || 0;
    let xpProxNivel = parseInt(xpProxNivelInput.value) || 1000;
    let nivel = parseInt(nivelInput.value) || 1;

    // Loop para lidar com múltiplos "level ups" de um único ganho de XP
    while (xpAtuais >= xpProxNivel && xpProxNivel > 0) {
        nivel++;
        xpAtuais -= xpProxNivel; // Carrega o XP excedente
        // Progressão de XP em T20: XP para ir do nível L para L+1 é L * 1000
        xpProxNivel = (nivel -1) * 1000 +1000;
    }

    // Atualiza os campos do formulário com os novos valores após a verificação de level-up
    nivelInput.value = `${nivel}`;
    xpAtuaisInput.value = `${xpAtuais}`;
    xpProxNivelInput.value = `${xpProxNivel}`;
    
    // Agora, atualize a barra com os valores finais
    const xpParaBarra = xpProxNivel > 0 ? xpProxNivel : 1;
    const xpPercent = Math.max(0, Math.min(100, (xpAtuais / xpParaBarra) * 100));

    document.getElementById('xp-fill').style.width = `${xpPercent}%`;
    document.getElementById('xp-text').textContent = `${xpAtuais} / ${xpProxNivel} XP`;
}

function atualizarCarga() {
    const forcaInput = document.getElementById('forca');
    if (!forcaInput) return;
    const forca = parseInt(forcaInput.value || '10');

    const capacidadeNormal = forca * 3;
    const capacidadeMaxima = forca * 10;

    document.getElementById('carga-normal').textContent = `${capacidadeNormal}kg`;
    document.getElementById('carga-maxima').textContent = `${capacidadeMaxima}kg`;

    let pesoTotal = 0;
    document.querySelectorAll('#lista-inventario .item-card').forEach(card => {
        const pesoInput = card.querySelector('input[data-field="peso"]');
        if (pesoInput) {
            pesoTotal += parseFloat(pesoInput.value) || 0;
        }
    });

    document.getElementById('carga-atual').textContent = `${pesoTotal.toFixed(1)}kg`;

    const cargaFill = document.getElementById('carga-fill');
    const percent = Math.min(100, (pesoTotal / capacidadeMaxima) * 100);
    cargaFill.style.width = `${percent > 0 ? percent : 0}%`;

    const defesaInput = document.getElementById('defesa');
    const deslocamentoInput = document.getElementById('deslocamento');
    const penalidadeAviso = document.getElementById('carga-penalidade');
    
    if (!defesaInput || !deslocamentoInput || !penalidadeAviso) return;

    if (!defesaInput.dataset.baseValue) {
        defesaInput.dataset.baseValue = defesaInput.value;
    }
    if (!deslocamentoInput.dataset.baseValue) {
        deslocamentoInput.dataset.baseValue = deslocamentoInput.value;
    }

    const baseDefesa = parseInt(defesaInput.dataset.baseValue);
    const baseDeslocamentoRaw = deslocamentoInput.dataset.baseValue;
    const baseDeslocamentoVal = parseInt(baseDeslocamentoRaw.replace(/[^0-9.]/g, '')) || 0;
    const baseDeslocamentoUnit = baseDeslocamentoRaw.replace(/[0-9.]/g, '') || 'm';

    if (pesoTotal > capacidadeMaxima) {
        cargaFill.style.backgroundColor = 'var(--cor-vermelho)';
        penalidadeAviso.innerHTML = '<strong>SOBRECARGA MÁXIMA!</strong> Não é possível carregar mais peso.';
        penalidadeAviso.style.display = 'block';
        defesaInput.value = `${baseDefesa - 2}`;
        deslocamentoInput.value = `${Math.max(0, baseDeslocamentoVal - 3)}${baseDeslocamentoUnit}`;
    } else if (pesoTotal > capacidadeNormal) {
        cargaFill.style.backgroundColor = 'var(--cor-ouro)';
        penalidadeAviso.innerHTML = '<strong>Carga Pesada:</strong> Penalidade de Armadura –2, Deslocamento –3m.';
        penalidadeAviso.style.display = 'block';
        defesaInput.value = `${baseDefesa - 2}`;
        deslocamentoInput.value = `${Math.max(0, baseDeslocamentoVal - 3)}${baseDeslocamentoUnit}`;
    } else {
        cargaFill.style.backgroundColor = 'var(--cor-pm)';
        penalidadeAviso.style.display = 'none';
        defesaInput.value = `${baseDefesa}`;
        deslocamentoInput.value = baseDeslocamentoRaw;
    }
}


// --- DYNAMIC CONTENT GENERATION ---
function gerarTabelaPericias() {
    const tbodyPericias = document.getElementById('lista-pericias');
    if (!tbodyPericias) return;
    tbodyPericias.innerHTML = '';
    periciasBase.forEach(pericia => {
        const pId = pericia.nome.toLowerCase().replace(/\s/g, '-');
        const attrAbrev = pericia.attr.toUpperCase();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="pericia-nome">${pericia.nome}</span>
                <span class="pericia-attr">(${attrAbrev})</span>
            </td>
            <td><span class="pericia-total" id="total-${pId}">+0</span></td>
            <td><span id="bonus-${pId}">+0</span></td>
            <td><input type="number" id="treino-${pId}" value="0" data-field="treino-${pId}"></td>
            <td><input type="number" id="outros-${pId}" value="0" data-field="outros-${pId}"></td>
        `;
        tbodyPericias.appendChild(tr);
    });
}

function criarItemDinamico(tipo, containerId, data = {}) {
    const id = `${tipo}-${Date.now()}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create main elements
    const card = document.createElement('details');
    card.className = 'item-card';
    card.id = id;
    card.setAttribute('data-type', tipo);
    card.open = Object.keys(data).length === 0;

    const summary = document.createElement('summary');
    const content = document.createElement('div');
    content.className = 'item-card-content';

    // Helper to create form fields. This prevents XSS by using .textContent and .value
    const createFieldGroup = (labelText, inputType, dataField, value, options = {}) => {
        const group = document.createElement('div');
        group.className = 'field-group';

        const label = document.createElement('label');
        label.textContent = labelText;
        group.appendChild(label);

        let input;
        if (inputType === 'textarea') {
            input = document.createElement('textarea');
        } else {
            input = document.createElement('input');
            input.type = inputType;
            if (inputType === 'number' && options.step) {
                input.step = options.step;
            }
        }
        
        input.dataset.field = dataField;
        // Use .value to safely set content, preventing HTML injection
        input.value = String(value ?? (inputType === 'number' ? 0 : ''));
        
        group.appendChild(input);
        return group;
    };

    // Helper to create summary text elements
    const createSummarySpan = (className, text) => {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = text;
        return span;
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;'; // Safe, no user data

    switch (tipo) {
        case 'ataque': {
            // Build summary
            const titulo = createSummarySpan('item-card-titulo', data.nome || 'Novo Ataque');
            const div = document.createElement('div');
            div.append(
                createSummarySpan('item-card-subtitulo', `Dano: ${data.dano || 'N/A'}`),
                createSummarySpan('item-card-subtitulo', `Crítico: ${data.critico || 'N/A'}`)
            );
            deleteBtn.setAttribute('aria-label', 'Remover Ataque');
            summary.append(titulo, div, deleteBtn);
            
            // Build content
            const grid = document.createElement('div');
            grid.className = 'grid-container';
            grid.append(
                createFieldGroup('Nome do Ataque', 'text', 'nome', data.nome),
                createFieldGroup('Teste de Ataque', 'text', 'teste', data.teste),
                createFieldGroup('Dano', 'text', 'dano', data.dano),
                createFieldGroup('Crítico', 'text', 'critico', data.critico)
            );
            const extraField = document.createElement('div');
            extraField.style.marginTop = '15px';
            extraField.appendChild(createFieldGroup('Alcance/Tipo', 'text', 'alcance', data.alcance));
            
            content.append(grid, extraField);
            break;
        }
        case 'magia': {
            // Build summary
            const titulo = createSummarySpan('item-card-titulo', data.nome || 'Nova Magia');
            const subtitulo = createSummarySpan('item-card-subtitulo', `Custo: ${data.custo || 'N/A'} PM`);
            deleteBtn.setAttribute('aria-label', 'Remover Magia');
            summary.append(titulo, subtitulo, deleteBtn);

            // Build content
            const grid = document.createElement('div');
            grid.className = 'grid-container';
            grid.append(
                createFieldGroup('Nome da Magia', 'text', 'nome', data.nome),
                createFieldGroup('Custo de PM', 'text', 'custo', data.custo),
                createFieldGroup('Execução', 'text', 'execucao', data.execucao),
                createFieldGroup('Alcance', 'text', 'alcance', data.alcance)
            );
            const extraField = document.createElement('div');
            extraField.style.marginTop = '15px';
            extraField.appendChild(createFieldGroup('Descrição/Efeito', 'textarea', 'descricao', data.descricao));
            
            content.append(grid, extraField);
            break;
        }
        case 'item': {
            // Build summary
            const titulo = createSummarySpan('item-card-titulo', data.nome || 'Novo Item');
            const subtitulo = createSummarySpan('item-card-subtitulo', `Peso: ${data.peso || 0}kg`);
            deleteBtn.setAttribute('aria-label', 'Remover Item');
            summary.append(titulo, subtitulo, deleteBtn);

            // Build content
            const grid = document.createElement('div');
            grid.className = 'grid-container';
            grid.style.gridTemplateColumns = '3fr 1fr';
            grid.append(
                createFieldGroup('Nome do Item', 'text', 'nome', data.nome),
                createFieldGroup('Peso (kg)', 'number', 'peso', data.peso, { step: '0.1' })
            );
            const extraField = document.createElement('div');
            extraField.style.marginTop = '15px';
            extraField.appendChild(createFieldGroup('Descrição/Espaços', 'textarea', 'descricao', data.descricao));
            
            content.append(grid, extraField);
            break;
        }
        case 'habilidade': {
            // Build summary
            const titulo = createSummarySpan('item-card-titulo', data.nome || 'Nova Habilidade/Poder');
            const emptySpan = document.createElement('span'); // for grid layout
            deleteBtn.setAttribute('aria-label', 'Remover Habilidade/Poder');
            summary.append(titulo, emptySpan, deleteBtn);
            
            // Build content
            const grid = document.createElement('div');
            grid.className = 'grid-container';
            grid.append(createFieldGroup('Nome', 'text', 'nome', data.nome));
            const extraField = document.createElement('div');
            extraField.style.marginTop = '15px';
            extraField.appendChild(createFieldGroup('Descrição', 'textarea', 'descricao', data.descricao));
            
            content.append(grid, extraField);
            break;
        }
    }
    
    // Assemble the card and add to the DOM
    card.appendChild(summary);
    card.appendChild(content);
    container.appendChild(card);
}

function atualizarSumario(input) {
    const card = input.closest('.item-card');
    if (!card) return;

    const field = input.dataset.field;
    const value = input.value;
    const title = card.querySelector('.item-card-titulo');
    const subtitles = card.querySelectorAll('.item-card-subtitulo');
    
    if (!title || !subtitles) return;

    switch(card.dataset.type) {
        case 'ataque':
            if (field === 'nome') title.textContent = value || 'Novo Ataque';
            if (field === 'dano' && subtitles[0]) subtitles[0].textContent = `Dano: ${value || 'N/A'}`;
            if (field === 'critico' && subtitles[1]) subtitles[1].textContent = `Crítico: ${value || 'N/A'}`;
            break;
        case 'magia':
            if (field === 'nome') title.textContent = value || 'Nova Magia';
            if (field === 'custo' && subtitles[0]) subtitles[0].textContent = `Custo: ${value || 'N/A'} PM`;
            break;
        case 'item':
            if (field === 'nome') title.textContent = value || 'Novo Item';
            if (field === 'peso' && subtitles[0]) subtitles[0].textContent = `Peso: ${value || 0}kg`;
            break;
        case 'habilidade':
            if (field === 'nome') title.textContent = value || 'Nova Habilidade/Poder';
            break;
    }
}

// --- EVENT HANDLERS ---
function handleDynamicListEvents(event) {
    const target = event.target;

    if (target.matches('.delete-btn')) {
        const card = target.closest('.item-card');
        const container = card?.parentElement;
        card?.remove();
        if (container?.id === 'lista-inventario') {
            atualizarCarga();
        }
    }

    if (target.matches('input[data-field], textarea[data-field]')) {
        atualizarSumario(target);
        if (target.closest('#lista-inventario')) {
             atualizarCarga();
        }
    }
}

function handleTabClick(event) {
    const clickedTab = event.currentTarget;
    const targetPanelId = clickedTab.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

    clickedTab.classList.add('active');
    document.getElementById(targetPanelId)?.classList.add('active');
}

function handleStatusControls(event) {
    const target = event.target;
    if (!target.matches('.bar-controls button')) return;

    const { op, stat } = target.dataset;
    const atuaisInput = document.getElementById(`${stat}_atuais`);
    const maxInput = document.getElementById(`${stat}_max`);
    
    let atuais = parseInt(atuaisInput.value);
    const max = parseInt(maxInput.value);

    switch(op) {
        case 'zero': atuais = 0; break;
        case 'dec': atuais--; break;
        case 'inc': atuais++; break;
        case 'max': atuais = max; break;
    }
    atuaisInput.value = `${Math.max(0, atuais)}`;
    atualizarBarrasStatus();
}

// --- MODAL LOGIC ---
function setupCreditsModal() {
    const modal = document.getElementById('credits-modal');
    const openBtn = document.getElementById('credits-btn');
    const closeBtn = modal?.querySelector('.modal-close-btn');

    if (!modal || !openBtn || !closeBtn) {
        return;
    }

    const openModal = () => modal.classList.add('visible');
    const closeModal = () => modal.classList.remove('visible');

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });
}

// --- MAIN LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- ADD BUTTON EVENTS ---
    document.getElementById('add-ataque-btn')?.addEventListener('click', () => criarItemDinamico('ataque', 'lista-ataques'));
    document.getElementById('add-magia-btn')?.addEventListener('click', () => criarItemDinamico('magia', 'lista-magias'));
    document.getElementById('add-item-btn')?.addEventListener('click', () => criarItemDinamico('item', 'lista-inventario'));
    document.getElementById('add-habilidade-btn')?.addEventListener('click', () => criarItemDinamico('habilidade', 'lista-habilidades'));

    // --- DYNAMIC LIST EVENTS (DELETION & UPDATE) ---
    ['lista-ataques', 'lista-magias', 'lista-inventario', 'lista-habilidades'].forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.addEventListener('click', handleDynamicListEvents);
            container.addEventListener('input', handleDynamicListEvents);
        }
    });

    // --- TAB NAVIGATION ---
    document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', handleTabClick));
    
    // --- IMPORT/EXPORT FUNCTIONALITY ---
    document.getElementById('exportar-btn')?.addEventListener('click', () => {
        const dadosFicha = {
            campos: {},
            pericias: {},
            ataques: [],
            magias: [],
            inventario: [],
            habilidades: []
        };

        document.querySelectorAll('input[data-field], textarea[data-field]').forEach(el => {
            if (!el.closest('.item-card') && !el.closest('.pericias-table')) {
                dadosFicha.campos[el.dataset.field] = el.value;
            }
        });
        
        document.querySelectorAll('#lista-pericias input').forEach(el => {
            dadosFicha.pericias[el.id] = el.value;
        });

        document.querySelectorAll('.item-card').forEach(card => {
            const itemData = { type: card.dataset.type };
            card.querySelectorAll('input, textarea').forEach(input => {
                if(input.dataset.field) {
                    itemData[input.dataset.field] = input.value;
                }
            });
            if (itemData.type === 'ataque') dadosFicha.ataques.push(itemData);
            if (itemData.type === 'magia') dadosFicha.magias.push(itemData);
            if (itemData.type === 'item') dadosFicha.inventario.push(itemData);
            if (itemData.type === 'habilidade') dadosFicha.habilidades.push(itemData);
        });

        const defesaInput = document.getElementById('defesa');
        const deslocamentoInput = document.getElementById('deslocamento');
        if (defesaInput) {
            dadosFicha.campos.defesa_base = defesaInput.dataset.baseValue || defesaInput.value;
        }
        if (deslocamentoInput) {
            dadosFicha.campos.deslocamento_base = deslocamentoInput.dataset.baseValue || deslocamentoInput.value;
        }

        const dataStr = JSON.stringify(dadosFicha, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        const nomePersonagem = dadosFicha.campos.nome || 'personagem';
        link.href = url;
        link.download = `ficha_t20_${nomePersonagem.toLowerCase().replace(/\s/g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    document.getElementById('importar-btn')?.addEventListener('click', () => document.getElementById('importar-input')?.click());
    
    document.getElementById('importar-input')?.addEventListener('change', (event) => {
        const target = event.target;
        const file = target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const dadosFicha = JSON.parse(e.target.result);

                ['lista-ataques', 'lista-magias', 'lista-inventario', 'lista-habilidades'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.innerHTML = '';
                });

                Object.keys(dadosFicha.campos).forEach(key => {
                    const selector = `[data-field="${key}"]`;
                    const el = document.querySelector(selector);
                    if (el && !el.closest('.item-card') && !el.closest('.pericias-table')) {
                        el.value = dadosFicha.campos[key];
                    }
                });
                
                Object.keys(dadosFicha.pericias).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = dadosFicha.pericias[id];
                });

                dadosFicha.ataques?.forEach((data) => criarItemDinamico('ataque', 'lista-ataques', data));
                dadosFicha.magias?.forEach((data) => criarItemDinamico('magia', 'lista-magias', data));
                dadosFicha.inventario?.forEach((data) => criarItemDinamico('item', 'lista-inventario', data));
                dadosFicha.habilidades?.forEach((data) => criarItemDinamico('habilidade', 'lista-habilidades', data));
                
                const defesaInput = document.getElementById('defesa');
                const deslocamentoInput = document.getElementById('deslocamento');

                if (defesaInput) {
                    defesaInput.dataset.baseValue = dadosFicha.campos.defesa_base || dadosFicha.campos.defesa;
                }
                if (deslocamentoInput) {
                    deslocamentoInput.dataset.baseValue = dadosFicha.campos.deslocamento_base || dadosFicha.campos.deslocamento;
                }

                atualizarModificadores();
                atualizarBarrasStatus();
                atualizarBarraXP();
                alert('Ficha importada com sucesso!');
            } catch (error) {
                alert('Erro ao importar o arquivo. Verifique se o formato é válido.');
                console.error("Erro no parse do JSON:", error);
            }
        };
        reader.readAsText(file);
        target.value = '';
    });

    // --- AUTOMATIC UPDATE LISTENERS ---
    document.getElementById('attributes-section')?.addEventListener('input', atualizarModificadores);
    document.getElementById('pericias')?.addEventListener('input', atualizarTotaisPericias);
    document.getElementById('status-section')?.addEventListener('input', atualizarBarrasStatus);
    document.getElementById('xp-section')?.addEventListener('input', atualizarBarraXP);
    document.getElementById('pv-status')?.addEventListener('click', handleStatusControls);
    document.getElementById('pm-status')?.addEventListener('click', handleStatusControls);
    document.getElementById('defesa')?.addEventListener('input', e => {
        const input = e.target;
        input.dataset.baseValue = input.value;
        atualizarCarga();
    });
    document.getElementById('deslocamento')?.addEventListener('input', e => {
        const input = e.target;
        input.dataset.baseValue = input.value;
        atualizarCarga();
    });


    // --- PAGE INITIALIZATION ---
    gerarTabelaPericias();
    atualizarModificadores();
    atualizarBarrasStatus();
    atualizarBarraXP();
    setupCreditsModal();
});