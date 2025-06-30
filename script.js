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

    while (xpAtuais >= xpProxNivel && xpProxNivel > 0) {
        nivel++;
        xpAtuais -= xpProxNivel;
        xpProxNivel = (nivel - 1) * 1000 + 1000;
    }

    nivelInput.value = `${nivel}`;
    xpAtuaisInput.value = `${xpAtuais}`;
    xpProxNivelInput.value = `${xpProxNivel}`;
    
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

    const card = document.createElement('details');
    card.className = 'item-card';
    card.id = id;
    card.setAttribute('data-type', tipo);
    card.open = Object.keys(data).length === 0;

    let summaryHTML = '';
    let contentHTML = '';

    switch (tipo) {
        case 'ataque':
            summaryHTML = `
                <span class="item-card-titulo">${data.nome || 'Novo Ataque'}</span>
                <div>
                    <span class="item-card-subtitulo">Dano: ${data.dano || 'N/A'}</span>
                    <span class="item-card-subtitulo">Crítico: ${data.critico || 'N/A'}</span>
                </div>
                <button class="delete-btn" aria-label="Remover Ataque">&times;</button>
            `;
            contentHTML = `
                <div class="grid-container">
                    <div class="field-group"><label>Nome do Ataque</label><input type="text" data-field="nome" value="${data.nome || ''}"></div>
                    <div class="field-group"><label>Teste de Ataque</label><input type="text" data-field="teste" value="${data.teste || ''}"></div>
                    <div class="field-group"><label>Dano</label><input type="text" data-field="dano" value="${data.dano || ''}"></div>
                    <div class="field-group"><label>Crítico</label><input type="text" data-field="critico" value="${data.critico || ''}"></div>
                </div>
                <div style="margin-top:15px;"><div class="field-group"><label>Alcance/Tipo</label><input type="text" data-field="alcance" value="${data.alcance || ''}"></div></div>
            `;
            break;
        case 'magia':
            summaryHTML = `
                <span class="item-card-titulo">${data.nome || 'Nova Magia'}</span>
                <span class="item-card-subtitulo">Custo: ${data.custo || 'N/A'} PM</span>
                <button class="delete-btn" aria-label="Remover Magia">&times;</button>
            `;
            contentHTML = `
                <div class="grid-container">
                    <div class="field-group"><label>Nome da Magia</label><input type="text" data-field="nome" value="${data.nome || ''}"></div>
                    <div class="field-group"><label>Custo de PM</label><input type="text" data-field="custo" value="${data.custo || ''}"></div>
                    <div class="field-group"><label>Execução</label><input type="text" data-field="execucao" value="${data.execucao || ''}"></div>
                    <div class="field-group"><label>Alcance</label><input type="text" data-field="alcance" value="${data.alcance || ''}"></div>
                </div>
                <div style="margin-top:15px;"><div class="field-group"><label>Descrição/Efeito</label><textarea data-field="descricao">${data.descricao || ''}</textarea></div></div>
            `;
            break;
        case 'item':
            summaryHTML = `
                <span class="item-card-titulo">${data.nome || 'Novo Item'}</span>
                <span class="item-card-subtitulo">Peso: ${data.peso || 0}kg</span>
                <button class="delete-btn" aria-label="Remover Item">&times;</button>
            `;
            contentHTML = `
                <div class="grid-container" style="grid-template-columns: 3fr 1fr;">
                    <div class="field-group"><label>Nome do Item</label><input type="text" data-field="nome" value="${data.nome || ''}"></div>
                    <div class="field-group"><label>Peso (kg)</label><input type="number" step="0.1" data-field="peso" value="${data.peso || 0}"></div>
                </div>
                <div style="margin-top:15px;"><div class="field-group"><label>Descrição/Espaços</label><textarea data-field="descricao">${data.descricao || ''}</textarea></div></div>
            `;
            break;
        case 'habilidade':
            summaryHTML = `
                <span class="item-card-titulo">${data.nome || 'Nova Habilidade/Poder'}</span>
                <span></span>
                <button class="delete-btn" aria-label="Remover Habilidade/Poder">&times;</button>
            `;
            contentHTML = `
                <div class="grid-container">
                    <div class="field-group"><label>Nome</label><input type="text" data-field="nome" value="${data.nome || ''}"></div>
                </div>
                <div style="margin-top:15px;"><div class="field-group"><label>Descrição</label><textarea data-field="descricao">${data.descricao || ''}</textarea></div></div>
            `;
            break;
    }

    card.innerHTML = `<summary>${summaryHTML}</summary><div class="item-card-content">${contentHTML}</div>`;
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
