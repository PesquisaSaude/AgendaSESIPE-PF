// Ajuste para a data atual fornecida (November 06, 2025)
let currentDate = new Date(2025, 10, 6); // Mês é 0-indexed, novembro é 10
let selectedDay = null;
let selectedHour = null;
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let blockedDates = JSON.parse(localStorage.getItem('blockedDates')) || [];
let blockedProfessionals = JSON.parse(localStorage.getItem('blockedProfessionals')) || [];
// Updated structure for day-specific schedules with per-period enabled flag and per-professional customs
let agendaSchedules = JSON.parse(localStorage.getItem('agendaSchedules')) || {
    'Agenda Odontológica': {
        global: {
            0: { periods: [ // Domingo - Disabled
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''}
            ] },
            1: { periods: [ // Segunda
                {enabled: true, start: '08:00', end: '11:00'},
                {enabled: true, start: '12:00', end: '12:50'},
                {enabled: true, start: '13:00', end: '17:00'}
            ] },
            2: { periods: [ // Terça
                {enabled: true, start: '08:00', end: '11:00'},
                {enabled: true, start: '12:00', end: '12:50'},
                {enabled: true, start: '13:00', end: '17:00'}
            ] },
            3: { periods: [ // Quarta
                {enabled: true, start: '08:00', end: '11:00'},
                {enabled: true, start: '12:00', end: '12:50'},
                {enabled: true, start: '13:00', end: '17:00'}
            ] },
            4: { periods: [ // Quinta
                {enabled: true, start: '08:00', end: '11:00'},
                {enabled: true, start: '12:00', end: '12:50'},
                {enabled: true, start: '13:00', end: '17:00'}
            ] },
            5: { periods: [ // Sexta
                {enabled: true, start: '08:00', end: '11:00'},
                {enabled: true, start: '12:00', end: '12:50'},
                {enabled: true, start: '13:00', end: '17:00'}
            ] },
            6: { periods: [ // Sábado - Disabled
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''}
            ] }
        },
        custom: {}
    },
    'Agenda Especialidades Médicas': {
        global: {
            0: { periods: [
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''}
            ] },
            1: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            2: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            3: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            4: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            5: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            6: { periods: [
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''}
            ] }
        },
        custom: {}
    },
    'Agenda de Exames': {
        global: {
            0: { periods: [
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''}
            ] },
            1: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            2: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            3: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            4: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            5: { periods: [
                {enabled: true, start: '07:00', end: '12:00'},
                {enabled: true, start: '14:00', end: '17:00'},
                {enabled: true, start: '', end: ''}
            ] },
            6: { periods: [
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''},
                {enabled: false, start: '', end: ''}
            ] }
        },
        custom: {}
    }
};
// Initialize custom schedules for all professionals using global as base
function initializeCustomSchedules() {
    dentists.forEach(prof => {
        const type = 'Agenda Odontológica';
        if (!agendaSchedules[type].custom) agendaSchedules[type].custom = {};
        if (!agendaSchedules[type].custom[prof]) {
            const schedule = JSON.parse(JSON.stringify(agendaSchedules[type].global));
            schedule.duration = professionalDurations[prof] || intervals[type];
            agendaSchedules[type].custom[prof] = schedule;
        }
    });
    medicalSpecialists.forEach(prof => {
        const type = 'Agenda Especialidades Médicas';
        if (!agendaSchedules[type].custom) agendaSchedules[type].custom = {};
        if (!agendaSchedules[type].custom[prof]) {
            const schedule = JSON.parse(JSON.stringify(agendaSchedules[type].global));
            schedule.duration = professionalDurations[prof] || intervals[type];
            agendaSchedules[type].custom[prof] = schedule;
        }
    });
    examSpecialists.forEach(prof => {
        const type = 'Agenda de Exames';
        if (!agendaSchedules[type].custom) agendaSchedules[type].custom = {};
        if (!agendaSchedules[type].custom[prof]) {
            const schedule = JSON.parse(JSON.stringify(agendaSchedules[type].global));
            schedule.duration = professionalDurations[prof] || intervals[type];
            agendaSchedules[type].custom[prof] = schedule;
        }
    });
}
const intervals = {
    'Agenda Odontológica': 20,
    'Agenda Especialidades Médicas': 30,
    'Agenda de Exames': 20
};
let appointmentDatesSet = new Set();
let editingId = null;
let deleteId = null;
let filteredAppointments = []; // Store filtered appointments for export
let debounceTimer; // Para debounce em filtros
let reportChart = null; // Reference to the chart instance
let attendanceChart = null; // Reference to the attendance chart instance
let productivityChart = null; // Reference to the productivity chart instance
let currentPrintId = null; // For print after schedule or existing
let isBlockedSectionOpen = false; // Flag to track if blocked section is open
let currentAgendaType = ''; // Track current agenda type for calendar blocks
let currentPatientCpf = ''; // Global para CPF do paciente atual no histórico
let currentPatientName = ''; // Global para nome do paciente atual no histórico
let currentPatientDate = ''; // Global para data do agendamento atual no histórico
let logoBase64 = ''; // Para imagens em impressões
let coloredLogoBase64 = ''; // Para imagem colorida em declarações
let discountObj = {}; // Objeto global para armazenar descontos durante o agendamento
let currentServicePrice = 0; // Preço atual do serviço para cálculos de desconto
let currentDeclarationId = null; // Global para ID do agendamento na declaração
let justScheduled = false; // Flag para indicar se um agendamento foi recém-criado
let currentActionId = null; // Global para ID da ação (inativação/reativação)
let currentActionType = ''; // Global para tipo de ação ('inactivate' ou 'reactivate')
// Objeto de preços para serviços (exemplo de valores - ajuste conforme necessário)
const prices = {
    // ... (keep existing combos, medical, and ultrassons as before)
    // Novos combos adicionados
    'Combo Masculino': 199.00,
    'Combo Ultrassons Femininos': 499.00,
    'Combo Psicologia': 358.00,
    // Refined new exams
    'ECG - Eletrocardiograma com Laudo Cardiológico': 45.00,
    'EEG - Eletroencefalograma': 78.00,
    'Espirometria': 36.00,
    'Espirometria com Fluxo Expiratório Máximo - Peak Flow': 33.00,
    'Teste Ergométrico': 175.00,
    'Audiometria / Impedanciometria': 152.00,
    'Audiometria': 55.00,
    'Radiografia Abdômen Simples': 61.00,
    'Radiografia Antebraço': 71.00,
    'Radiografia Articulação Coxo Femural': 72.00,
    'Radiografia Articulação Têmporo Mandibular (ATM)': 96.00,
    'Radiografia Bacia': 72.00,
    'Radiografia Braço': 71.00,
    'Radiografia Calcâneo PA + Perfil': 71.00,
    'Radiografia Cavum (Seios da Face)': 61.00,
    'Radiografia Coluna Cervical PA + Perfil': 72.00,
    'Radiografia Coluna Cervical PA + Perfil + Oblíqua': 120.00,
    'Radiografia Coluna Dorsal PA + Perfil': 72.00,
    'Radiografia Coluna Lombar PA + Perfil': 72.00,
    'Radiografia Coluna Lombo Sacra PA + Perfil': 72.00,
    'Radiografia Coluna Toraco Lombar PA + Perfil': 120.00,
    'Radiografia Coluna Vertebral PA + Perfil (Total)': 226.00,
    'Radiografia Cotovelo': 61.00,
    'Radiografia Coxa': 85.00,
    'Radiografia Crânio': 71.00,
    'Radiografia Crânio PA + Perfil + Oblíqua + Hirtz': 92.00,
    'Radiografia Joelho': 71.00,
    'Radiografia Joelho PA + Perfil + Axial': 80.00,
    'Radiografia Mão PA + Perfil': 71.00,
    'Radiografia Ombro': 71.00,
    'Radiografia Ombro PA + Axial + Omoplata': 85.00,
    'Radiografia Pata de Rã': 72.00,
    'Radiografia Pé PA + Oblíqua': 71.00,
    'Radiografia Periodontal (por Tomada Radiográfica)': 40.00,
    'Radiografia Perna PA + Perfil': 71.00,
    'Radiografia Punho PA + Perfil': 71.00,
    'Radiografia Seios da Face Frontal + Mento-nasal': 71.00,
    'Radiografia Seios da Face Frontal + Mento-nasal + Perfil': 61.00,
    'Radiografia Tórax PA': 120.00,
    'Radiografia Tórax PA + Perfil + Oblíqua': 157.00,
    'Radiografia Tórax PA com Laudo OIT': 80.00,
    'Radiografia Tórax PA e Perfil': 71.00,
    'Radiografia Tornozelo PA + Perfil': 85.00,
    'Exames Laboratoriais': 0.00 // Explicitamente zerado para clareza, como discutimos
};
// Função para carregar imagem como base64 (melhorada com retry e fallback)
function getImageBase64(src, retries = 3) {
    return new Promise((resolve, reject) => {
        const loadImage = (attempt) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL('image/png');
                console.log('Logo carregado como base64 com sucesso.');
                resolve(base64);
            };
            img.onerror = () => {
                console.error(`Erro ao carregar imagem (tentativa ${attempt}): ${src}`);
                if (attempt < retries) {
                    console.log(`Tentando novamente em 500ms... (tentativa ${attempt + 1})`);
                    setTimeout(() => loadImage(attempt + 1), 500);
                } else {
                    console.warn('Falha ao carregar logo após tentativas. Usando fallback vazio.');
                    resolve(''); // Resolve vazio após retries
                }
            };
            img.src = src + '?t=' + new Date().getTime(); // Cache busting para forçar reload
        };
        loadImage(1);
    });
}
const holidays = [
    // 2025
    new Date(2025, 0, 1), // Confraternização Universal
    new Date(2025, 2, 3), // Carnaval (Segunda-feira)
    new Date(2025, 2, 4), // Carnaval (Terça-feira)
    new Date(2025, 3, 18), // Paixão de Cristo
    new Date(2025, 3, 21), // Tiradentes
    new Date(2025, 4, 1), // Dia do Trabalho
    new Date(2025, 5, 19), // Corpus Christi
    new Date(2025, 8, 7), // Independência do Brasil
    new Date(2025, 9, 12), // Nossa Sra. a Aparecida - Padroeira do Brasil
    new Date(2025, 10, 2), // Finados
    new Date(2025, 10, 15), // Proclamação da República
    new Date(2025, 11, 25), // Natal
    // 2026
    new Date(2026, 0, 1), // Confraternização Universal
    new Date(2026, 1, 16), // Carnaval (Segunda-feira)
    new Date(2026, 1, 17), // Carnaval (Terça-feira)
    new Date(2026, 3, 3), // Paixão de Cristo
    new Date(2026, 3, 21), // Tiradentes
    new Date(2026, 4, 1), // Dia do Trabalho
    new Date(2026, 5, 4), // Corpus Christi
    new Date(2026, 8, 7), // Independência do Brasil
    new Date(2026, 9, 12), // Nossa Sra. a Aparecida - Padroeira do Brasil
    new Date(2026, 10, 2), // Finados
    new Date(2026, 10, 15), // Proclamação da República
    new Date(2026, 11, 25), // Natal
    // 2027
    new Date(2027, 0, 1), // Confraternização Universal
    new Date(2027, 1, 8), // Carnaval (Segunda-feira)
    new Date(2027, 1, 9), // Carnaval (Terça-feira)
    new Date(2027, 2, 26), // Paixão de Cristo
    new Date(2027, 3, 21), // Tiradentes
    new Date(2027, 4, 1), // Dia do Trabalho
    new Date(2027, 4, 27), // Corpus Christi
    new Date(2027, 8, 7), // Independência do Brasil
    new Date(2027, 9, 12), // Nossa Sra. a Aparecida - Padroeira do Brasil
    new Date(2027, 10, 2), // Finados
    new Date(2027, 10, 15), // Proclamação da República
    new Date(2027, 11, 25) // Natal
];
const holidayNames = {
    '2025-01-01': 'Confraternização Universal',
    '2025-03-03': 'Carnaval (Segunda-feira)',
    '2025-03-04': 'Carnaval (Terça-feira)',
    '2025-04-18': 'Paixão de Cristo',
    '2025-04-21': 'Tiradentes',
    '2025-05-01': 'Dia do Trabalho',
    '2025-06-19': 'Corpus Christi',
    '2025-09-07': 'Independência do Brasil',
    '2025-10-12': 'Nossa Sra. a Aparecida - Padroeira do Brasil',
    '2025-11-02': 'Finados',
    '2025-11-15': 'Proclamação da República',
    '2025-12-25': 'Natal',
    '2026-01-01': 'Confraternização Universal',
    '2026-02-16': 'Carnaval (Segunda-feira)',
    '2026-02-17': 'Carnaval (Terça-feira)',
    '2026-04-03': 'Paixão de Cristo',
    '2026-04-21': 'Tiradentes',
    '2026-05-01': 'Dia do Trabalho',
    '2026-06-04': 'Corpus Christi',
    '2026-09-07': 'Independência do Brasil',
    '2026-10-12': 'Nossa Sra. a Aparecida - Padroeira do Brasil',
    '2026-11-02': 'Finados',
    '2026-11-15': 'Proclamação da República',
    '2026-12-25': 'Natal',
    '2027-01-01': 'Confraternização Universal',
    '2027-02-08': 'Carnaval (Segunda-feira)',
    '2027-02-09': 'Carnaval (Terça-feira)',
    '2027-03-26': 'Paixão de Cristo',
    '2027-04-21': 'Tiradentes',
    '2027-05-01': 'Dia do Trabalho',
    '2027-05-27': 'Corpus Christi',
    '2027-09-07': 'Independência do Brasil',
    '2027-10-12': 'Nossa Sra. a Aparecida - Padroeira do Brasil',
    '2027-11-02': 'Finados',
    '2027-11-15': 'Proclamação da República',
    '2027-12-25': 'Natal'
};
function getHolidayName(date) {
    const key = date.toISOString().split('T')[0];
    return holidayNames[key] || 'Feriado Nacional';
}
const agendaTypes = [
    'Agenda Odontológica',
    'Agenda Especialidades Médicas',
    'Agenda de Exames'
];
const dentists = [
    'Dra. Ana Paula',
    'Dr. Carlson',
    'Dra. Cinara',
    'Dr. Edson',
    'Dr. João Santos'
];
const medicalSpecialists = [
    'Combo Masculino',
    'Combo Ultrassons Femininos',
    'Combo Psicologia',
    'Combo Otorrino',
    'Combo Nutricional',
    'Combo Ginecologista',
    'Combo Coração',
    'Cardiologista',
    'Clínico Geral',
    'Ginecologista',
    'Otorrino',
    'Oftalmologista',
    'Psicologia',
    'Nutricionista'
];
const examSpecialists = [
    // Existing ultrassons unchanged
    'Ultrassonografia Abdômen Superior',
    'Ultrassonografia Abdômen Total',
    'Ultrassonografia Axila',
    'Ultrassonografia Bolsa Escrotal',
    'Ultrassonografia Mamária',
    'Ultrassonografia Obstétrica',
    'Ultrassonografia Parede Abdominal',
    'Ultrassonografia Partes Moles (Couro Cabeludo)',
    'Ultrassonografia Partes Moles (Membros Superiores e Inferiores)',
    'Ultrassonografia Partes Moles (Região Cervical)',
    'Ultrassonografia Partes Moles (Região Dorsal)',
    'Ultrassonografia Partes Moles (Região Inframandibular)',
    'Ultrassonografia Partes Moles (Região Lombar)',
    'Ultrassonografia Partes Moles (Tórax)',
    'Ultrassonografia Pós-ita',
    'Ultrassonografia Região Inguinal',
    'Ultrassonografia Tireóide',
    'Ultrassonografia Transretal',
    'Ultrassonografia Transvaginal',
    // Refined new exams (filtered out invalids like Periapical with R$ -)
    'ECG - Eletrocardiograma com Laudo Cardiológico',
    'EEG - Eletroencefalograma',
    'Espirometria',
    'Espirometria com Fluxo Expiratório Máximo - Peak Flow',
    'Teste Ergométrico',
    'Audiometria / Impedanciometria',
    'Audiometria',
    'Radiografia Abdômen Simples',
    'Radiografia Antebraço',
    'Radiografia Articulação Coxo Femural',
    'Radiografia Articulação Têmporo Mandibular (ATM)',
    'Radiografia Bacia',
    'Radiografia Braço',
    'Radiografia Calcâneo PA + Perfil',
    'Radiografia Cavum (Seios da Face)',
    'Radiografia Coluna Cervical PA + Perfil',
    'Radiografia Coluna Cervical PA + Perfil + Oblíqua',
    'Radiografia Coluna Dorsal PA + Perfil',
    'Radiografia Coluna Lombar PA + Perfil',
    'Radiografia Coluna Lombo Sacra PA + Perfil',
    'Radiografia Coluna Toraco Lombar PA + Perfil',
    'Radiografia Coluna Vertebral PA + Perfil (Total)',
    'Radiografia Cotovelo',
    'Radiografia Coxa',
    'Radiografia Crânio',
    'Radiografia Crânio PA + Perfil + Oblíqua + Hirtz',
    'Radiografia Joelho',
    'Radiografia Joelho PA + Perfil + Axial',
    'Radiografia Mão PA + Perfil',
    'Radiografia Ombro',
    'Radiografia Ombro PA + Axial + Omoplata',
    'Radiografia Pata de Rã',
    'Radiografia Pé PA + Oblíqua',
    'Radiografia Periodontal (por Tomada Radiográfica)',
    'Radiografia Perna PA + Perfil',
    'Radiografia Punho PA + Perfil',
    'Radiografia Seios da Face Frontal + Mento-nasal',
    'Radiografia Seios da Face Frontal + Mento-nasal + Perfil',
    'Radiografia Tórax PA',
    'Radiografia Tórax PA + Perfil + Oblíqua',
    'Radiografia Tórax PA com Laudo OIT',
    'Radiografia Tórax PA e Perfil',
    'Radiografia Tornozelo PA + Perfil',
    'Exames Laboratoriais' // Adicionado no final, como item genérico sem preço associado
];
const locations = [
    'SESI Saúde - Santo Amaro',
    'Posto Avançado - SESI Paulista'
];
const locationAddresses = {
    'SESI Saúde - Santo Amaro': 'Rua Frei Cassimiro, 88 - Santo Amaro, Recife - PE, 50100-260',
    'Posto Avançado - SESI Paulista': 'Tv. São Pedro, 2800 - Artur Lundgren I, Paulista - PE, 53417-040'
};
// Profissionais restritos para Posto Avançado - SESI Paulista
const paulistaRestricted = {
    'Agenda Odontológica': dentists, // Todos os dentistas
    'Agenda Especialidades Médicas': ['Clínico Geral', 'Nutricionista'],
    'Agenda de Exames': [
        'Audiometria',
        'Exames Laboratoriais',
        'Ultrassonografia Abdômen Superior',
        'Ultrassonografia Abdômen Total',
        'Ultrassonografia Axila',
        'Ultrassonografia Bolsa Escrotal',
        'Ultrassonografia Mamária',
        'Ultrassonografia Obstétrica',
        'Ultrassonografia Parede Abdominal',
        'Ultrassonografia Partes Moles (Couro Cabeludo)',
        'Ultrassonografia Partes Moles (Membros Superiores e Inferiores)',
        'Ultrassonografia Partes Moles (Região Cervical)',
        'Ultrassonografia Partes Moles (Região Dorsal)',
        'Ultrassonografia Partes Moles (Região Inframandibular)',
        'Ultrassonografia Partes Moles (Região Lombar)',
        'Ultrassonografia Partes Moles (Tórax)',
        'Ultrassonografia Pós-ita',
        'Ultrassonografia Região Inguinal',
        'Ultrassonografia Tireóide',
        'Ultrassonografia Transretal',
        'Ultrassonografia Transvaginal'
    ]
};
const professionalDurations = {
    // Dental
    'Dra. Ana Paula': 20,
    'Dr. Carlson': 20,
    'Dra. Cinara': 50,
    'Dr. Edson': 50,
    'Dr. João Santos': 20,
    // Medical
    'Clínico Geral': 30,
    'Cardiologista': 20,
    'Oftalmologista': 25,
    'Otorrino': 20,
    'Ginecologista': 40,
    'Psicologia': 60,
    'Nutricionista': 50
};
// Helper functions for time
function parseTime(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}
function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
function formatPeriod(period) {
    if (!period.start || !period.end) return '';
    return `${period.start} ${period.end}`;
}
function parsePeriodInput(value) {
    const parts = value.trim().split(/\s+/);
    if (parts.length >= 2) {
        return { start: parts[0], end: parts[1] };
    }
    return { start: '', end: '' };
}
// Updated generateSlots for day-specific with per-period enabled check and per-professional custom
function generateSlotsForDay(agendaType, dayOfWeek, professional = null) {
    const typeSchedules = agendaSchedules[agendaType];
    if (!typeSchedules) return [];
    let schedule;
    if (professional && typeSchedules.custom && typeSchedules.custom[professional]) {
        schedule = typeSchedules.custom[professional];
    } else {
        schedule = typeSchedules.global;
    }
    const daySchedule = schedule?.[dayOfWeek];
    if (!daySchedule) return [];
    const enabledPeriods = daySchedule.periods.filter(p => p.enabled && p.start && p.end);
    if (enabledPeriods.length === 0) {
        console.log(`Nenhum período enabled para ${agendaType}, dia ${dayOfWeek}${professional ? `, prof ${professional}` : ''}`); // Debug
        return [];
    }
    let slots = [];
    const interval = professional ? (schedule.duration || intervals[agendaType]) : intervals[agendaType]; // Usa duration custom
    enabledPeriods.forEach(period => {
        let currentMin = parseTime(period.start);
        const endMin = parseTime(period.end);
        while (currentMin + interval <= endMin) {
            slots.push(formatTime(currentMin));
            currentMin += interval;
        }
    });
    const uniqueSlots = [...new Set(slots)].sort();
    console.log(`Slots gerados para ${agendaType}, dia ${dayOfWeek}${professional ? `, prof ${professional}` : ''}: ${uniqueSlots.length} slots`); // Debug
    return uniqueSlots;
}
function getDuration(agendaType, professional) {
    if (!agendaSchedules[agendaType] || !agendaSchedules[agendaType].custom || !agendaSchedules[agendaType].custom[professional]) return null;
    return agendaSchedules[agendaType].custom[professional].duration;
}
function getHoursFor(agendaType, dayOfWeek, professional = null) {
    return generateSlotsForDay(agendaType, dayOfWeek, professional);
}
function getStatusText(status) {
    switch (status) {
        case 'attended': return 'Compareceu';
        case 'no-show': return 'Não Compareceu';
        case 'rescheduled': return 'Reagendado';
        case 'inactive': return 'Inativo';
        default: return 'Pendente';
    }
}
function getStatusClass(status) {
    switch (status) {
        case 'attended': return 'attended';
        case 'no-show': return 'no-show';
        case 'rescheduled': return 'rescheduled';
        case 'inactive': return 'inactive';
        default: return 'pending';
    }
}
function updateAppointmentDatesSet() {
    appointmentDatesSet.clear();
    appointments.forEach(apt => {
        const [day, mon, yr] = apt.date.split('/');
        appointmentDatesSet.add(new Date(yr, mon - 1, day).toDateString());
    });
}
function isHoliday(date) {
    return holidays.some(holiday => holiday.toDateString() === date.toDateString());
}
function formatDateToYYYYMMDD(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function isBlocked(dateStr, agendaType = null) {
    if (!agendaType) {
        return blockedDates.some(b => b.date === dateStr);
    }
    return blockedDates.some(b => b.date === dateStr && b.agendaType === agendaType);
}
function isProfessionalBlockedOnDate(professional, agendaType, dateYYYY) {
    return blockedProfessionals.some(bp => {
        if (bp.professional === professional && bp.agendaType === agendaType) {
            if (!bp.startDate || !bp.endDate) return true;
            return dateYYYY >= bp.startDate && dateYYYY <= bp.endDate;
        }
        return false;
    });
}
function isProfessionalBlocked(professional, agendaType) {
    const today = new Date().toISOString().split('T')[0];
    return isProfessionalBlockedOnDate(professional, agendaType, today);
}
// Função para sanitizar inputs (básica contra XSS)
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
function formatCPF(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})/, "$1-$2");
    input.value = value;
}
function formatFilterCPF(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})/, "$1-$2");
    input.value = value;
}
function validateCPF(input) {
    const cpf = input.value.replace(/\D/g, '');
    const errorEl = document.getElementById('cpfError');
    const isValid = cpf.length === 11 && isValidCPF(cpf);
    if (isValid) {
        input.classList.remove('error');
        errorEl.style.display = 'none';
        input.removeAttribute('aria-invalid');
    } else if (input.value.trim()) {
        input.classList.add('error');
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
    }
    updateScheduleButton();
}
function isValidCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder >= 10 ? 0 : remainder;
    if (parseInt(cpf[9]) !== digit1) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder >= 10 ? 0 : remainder;
    return parseInt(cpf[10]) === digit2;
}
function formatPhone(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length >= 11) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length >= 7) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (value.length >= 2) {
        value = value.replace(/^(\d{2})/, "($1) ");
    }
    input.value = value;
}
function validatePhone(input) {
    const phone = input.value.replace(/\D/g, '');
    const errorEl = document.getElementById('phoneError');
    const isValid = phone.length >= 10 && phone.length <= 11;
    if (isValid) {
        input.classList.remove('error');
        errorEl.style.display = 'none';
        input.removeAttribute('aria-invalid');
    } else if (input.value.trim()) {
        input.classList.add('error');
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
    }
    updateScheduleButton();
}
function validateEditCPF(input) {
    const cpf = input.value.replace(/\D/g, '');
    const errorEl = document.getElementById('editCpfError');
    const isValid = cpf.length === 11 && isValidCPF(cpf);
    if (isValid) {
        input.classList.remove('error');
        errorEl.style.display = 'none';
        input.removeAttribute('aria-invalid');
    } else if (input.value.trim()) {
        input.classList.add('error');
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
    }
}
function validateEditPhone(input) {
    const phone = input.value.replace(/\D/g, '');
    const errorEl = document.getElementById('editPhoneError');
    const isValid = phone.length >= 10 && phone.length <= 11;
    if (isValid) {
        input.classList.remove('error');
        errorEl.style.display = 'none';
        input.removeAttribute('aria-invalid');
    } else if (input.value.trim()) {
        input.classList.add('error');
        errorEl.style.display = 'block';
        input.setAttribute('aria-invalid', 'true');
    }
}
function getProfessionals(agendaType) {
    if (agendaType === 'Agenda Odontológica') {
        return dentists;
    } else if (agendaType === 'Agenda Especialidades Médicas') {
        return medicalSpecialists;
    } else if (agendaType === 'Agenda de Exames') {
        return examSpecialists;
    }
    return [];
}
function populateProfessionals(agendaType, selectId, location = '') {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Selecione um profissional</option>';
    if (!agendaType) return;
    let professionals = getProfessionals(agendaType);
    if (location === 'Posto Avançado - SESI Paulista') {
        professionals = professionals.filter(prof => paulistaRestricted[agendaType].includes(prof));
    }
    professionals.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof;
        option.textContent = prof;
        select.appendChild(option);
    });
}
function populateBlockProfessionalSelect() {
    const agendaType = document.getElementById('blockProfessionalAgendaType').value;
    const select = document.getElementById('blockProfessionalSelect');
    select.innerHTML = '<option value="">Selecione o profissional</option>';
    const professionals = getProfessionals(agendaType);
    professionals.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof;
        option.textContent = prof;
        select.appendChild(option);
    });
}
function populateEditProfessionals() {
    const agendaType = document.getElementById('editAgendaTypeSelect').value;
    const location = document.getElementById('editLocationSelect').value;
    populateProfessionals(agendaType, 'editDentistSelect', location);
}
function populateEditTimes() {
    const agendaTypeSelect = document.getElementById('editAgendaTypeSelect');
    const dentistSelect = document.getElementById('editDentistSelect');
    const agendaType = agendaTypeSelect.value;
    const professional = dentistSelect.value;
    const timeSelect = document.getElementById('editTime');
    timeSelect.innerHTML = '';
    let hours;
    if (agendaType && professional) {
        // Use day 1 (Monday) for example
        hours = getHoursFor(agendaType, 1, professional);
    } else if (agendaType) {
        hours = getHoursFor(agendaType, 1);
    } else {
        hours = getHoursFor('Agenda Especialidades Médicas', 1);
    }
    hours.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        timeSelect.appendChild(opt);
    });
}
async function generatePDF(appointmentId, format) {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return;
    const isThermal = format === 'thermal';
    const generatedDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const schedulerName = apt.scheduler ? sanitizeInput(apt.scheduler) : 'Não informado';
    const cnpj = apt.location && apt.location.includes('Paulista') ? '03.910.210/0025-82' : '03.910.210/0002-52';
    let originalPrice = prices[apt.professional] || 0;
    let industryAmount = 0;
    let promotionalAmount = 0;
    let discountedPrice = originalPrice;
    let industryDiscountLine = '';
    let promotionalDiscountLine = '';
    let promotionalPeriodLine = '';
    if (apt.discount) {
        if (apt.discount.industry) {
            const industryDiscount = apt.discount.industry;
            industryAmount = originalPrice * (industryDiscount / 100);
            discountedPrice = originalPrice * (1 - industryDiscount / 100);
            industryDiscountLine = `Desconto Indústria: ${industryDiscount}%`;
        }
        if (apt.discount.promotional) {
            const promotionalDiscount = apt.discount.promotional;
            promotionalAmount = discountedPrice * (promotionalDiscount / 100);
            discountedPrice = discountedPrice * (1 - promotionalDiscount / 100);
            promotionalDiscountLine = `Desconto Promocional: ${promotionalDiscount}%`;
        }
        if (apt.discount.promotion && (apt.agendaType === 'Agenda de Exames' || apt.agendaType === 'Agenda Especialidades Médicas')) {
            const { name, start, end } = apt.discount.promotion;
            if (name && start && end) {
                promotionalPeriodLine = `${name}: de ${new Date(start).toLocaleDateString('pt-BR')} a ${new Date(end).toLocaleDateString('pt-BR')}`;
            }
        }
    }
    if (isThermal) {
        let title = apt.agendaType === 'Agenda de Exames' ? 'ORÇAMENTO DE EXAMES' : 'COMPROVANTE DE AGENDAMENTO';
        let printContent = `
            <html>
            <head>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
              <title>${title}</title>
              <style>
                @page {
                  margin: 0;
                }
                body {
                  font-family: monospace;
                  font-size: 10pt;
                  margin: 0;
                  padding: 0 5mm 5mm 0;
                  width: 80mm;
                  line-height: 1.2;
                  color: #000;
                  background: #fff;
                  text-align: left;
                }
                .line { margin-bottom: 0.3em; }
                .divider {
                  border-top: 1px dashed #000;
                  margin: 0.5em 0;
                }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .warning {
                  margin: 0.5em 0;
                  font-size: 9pt;
                  text-align: center;
                }
                .warning-title {
                  font-weight: bold;
                  text-align: center;
                }
                .thermal-logo {
                  display: block;
                  margin: 0 auto 0.5em auto;
                  max-width: 60mm;
                  max-height: 15mm;
                  width: auto;
                  height: auto;
                  filter: grayscale(100%) contrast(200%) brightness(0%);
                  image-rendering: -webkit-optimize-contrast;
                  image-rendering: crisp-edges;
                }
                .discount-line {
                  font-weight: bold;
                  color: #000;
                }
              </style>
            </head>
            <body>
              ${logoBase64 ? `<img src="${logoBase64}" alt="Logo SESI" class="thermal-logo">` : ''}
              <div class="center bold line">SERVIÇO SOCIAL DA INDÚSTRIA</div>
              <div class="center line">CNPJ: ${cnpj}</div>
              <div class="center bold line">${title}</div>
        `;
        if (apt.agendaType === 'Agenda de Exames') {
            printContent += `
              <div class="line">Responsável pelo Orçamento: ${schedulerName || ''}</div>
              <div class="line">Paciente: ${apt.patient}</div>
              <div class="line">Telefone do Paciente: ${apt.phone || ''}</div>
              <div class="line">Tipo de Atendimento: ${apt.professional || ''}</div>
              <div class="discount-line line">Valor Original: R$ ${originalPrice.toFixed(2)}</div>
              ${industryDiscountLine ? `<div class="discount-line line">${industryDiscountLine}</div>` : ''}
              ${promotionalDiscountLine ? `<div class="discount-line line">${promotionalDiscountLine}</div>` : ''}
              ${promotionalPeriodLine ? `<div class="discount-line line">${promotionalPeriodLine}</div>` : ''}
              <div class="discount-line line">Valor Final: R$ ${discountedPrice.toFixed(2)}</div>
              ${apt.observations ? `<div class="line">Obs.: ${apt.observations}</div>` : ''}
              <div class="divider"></div>
              <div class="center line">Endereço: ${locationAddresses[apt.location] || 'Endereço não especificado'}</div>
            `;
        } else if (apt.agendaType === 'Agenda Odontológica') {
            printContent += `
              <div class="line">Data: ${apt.date || ''}</div>
              <div class="line">Horário: ${apt.time || ''}</div>
              <div class="line">Paciente: ${apt.patient || ''}</div>
              <div class="line">CPF: ${apt.cpf || ''}</div>
              <div class="line">Telefone: ${apt.phone || ''}</div>
              ${schedulerName ? `<div class="line">Responsável pelo Agendamento: ${schedulerName}</div>` : ''}
              <div class="line">Profissional: ${apt.professional || ''}</div>
              <div class="line">Tipo: ${apt.agendaType || ''}</div>
              <div class="line">Local: ${apt.location || ''}</div>
              <div class="divider"></div>
              ${apt.priority ? `<div class="line">Prioritário: ${apt.priority}</div>` : ''}
              ${apt.firstAppointment ? `<div class="line">1º Atendimento: ${apt.firstAppointment}</div>` : ''}
              ${apt.observations ? `<div class="line">Obs.: ${apt.observations}</div>` : ''}
              <div class="center line">Endereço: ${locationAddresses[apt.location] || 'Endereço não especificado'}</div>
            `;
        } else {
            printContent += `
              <div class="line">Data: ${apt.date || ''}</div>
              <div class="line">Horário: ${apt.time || ''}</div>
              <div class="line">Paciente: ${apt.patient || ''}</div>
              <div class="line">CPF: ${apt.cpf || ''}</div>
              <div class="line">Telefone: ${apt.phone || ''}</div>
              ${schedulerName ? `<div class="line">Responsável pelo Agendamento: ${schedulerName}</div>` : ''}
              <div class="line">Profissional: ${apt.professional || ''}</div>
              <div class="line">Tipo: ${apt.agendaType || ''}</div>
              <div class="line">Local: ${apt.location || ''}</div>
              <div class="discount-line line">Valor Original: R$ ${originalPrice.toFixed(2)}</div>
              ${industryDiscountLine ? `<div class="discount-line line">${industryDiscountLine}</div>` : ''}
              ${promotionalDiscountLine ? `<div class="discount-line line">${promotionalDiscountLine}</div>` : ''}
              ${promotionalPeriodLine ? `<div class="discount-line line">${promotionalPeriodLine}</div>` : ''}
              <div class="discount-line line">Valor Final: R$ ${discountedPrice.toFixed(2)}</div>
              <div class="divider"></div>
              ${apt.priority ? `<div class="line">Prioritário: ${apt.priority}</div>` : ''}
              ${apt.firstAppointment ? `<div class="line">1º Atendimento: ${apt.firstAppointment}</div>` : ''}
              ${apt.observations ? `<div class="line">Obs.: ${apt.observations}</div>` : ''}
              <div class="center line">Endereço: ${locationAddresses[apt.location] || 'Endereço não especificado'}</div>
            `;
        }
        printContent += `
              <div class="line">Gerado em: ${generatedDate}</div>
              <div class="divider"></div>
              <div class="warning">
                <div class="warning-title bold">AVISO IMPORTANTE !</div>
                <div class="line">Ao solicitar o agendamento de consultas e exames, o cliente autoriza o uso de seus dados pessoais (nome, telefone, CPF) exclusivamente para essa finalidade. O agendamento possui validade a partir da data de sua solicitação até o término do ano corrente (2025). Durante esse período, os valores poderão ser atualizados, inclusive em razão de campanhas promocionais ou ajustes de tabela.
Caso o atendimento seja confirmado em data posterior ao prazo de validade ou em período com novas condições comerciais, o cliente será previamente informado sobre eventuais alterações nos preços antes da efetivação do agendamento.</div>
              </div>
              <div class="center line">Apresente este comprovante no dia do atendimento.</div>
            </body>
            </html>
        `;
        const printWindow = window.open('', '_blank', 'width=300,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    } else {
        let title = apt.agendaType === 'Agenda de Exames' ? 'Orçamento de Exames e Especialidades' : 'Comprovante de Agendamento';
        const address = locationAddresses[apt.location] || 'Endereço não especificado';
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        let printContent = `
            <html>
            <head>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
              <title>${title}</title>
              <style>
                @page {
                  size: A4;
                  margin: 1.5cm 1cm;
                  @bottom-center {
                    content: "Página " counter(page) " de " counter(pages);
                    font-size: 10pt;
                    color: #666;
                  }
                }
                body {
                  font-family: 'Roboto', Arial, sans-serif;
                  font-size: 11pt;
                  margin: 0;
                  padding: 0;
                  line-height: 1.5;
                  color: #000;
                  background: white;
                  text-align: left;
                  width: 100%;
                }
                .print-container {
                  max-width: 210mm;
                  margin: 0 auto;
                  padding: 20px;
                  border: 2px solid #007bff;
                  border-radius: 8px;
                  background: #ffffff;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .print-header {
                  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                  color: white;
                  padding: 20px;
                  border-radius: 8px 8px 0 0;
                  margin: -20px -20px 20px -20px;
                  text-align: center;
                  position: relative;
                  overflow: hidden;
                }
                .print-header::after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: rgba(255,255,255,0.2);
                }
                .header-container {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 15px;
                  flex-wrap: wrap;
                }
                .logo-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  flex: 0 0 auto;
                }
                .logo-container img {
                  max-width: 120px;
                  height: auto;
                  margin-bottom: 5px;
                }
                .logo-container p {
                  margin: 0;
                  font-size: 9pt;
                  color: rgba(255,255,255,0.9);
                  text-align: center;
                  font-weight: 300;
                }
                .title-container {
                  flex: 1;
                  text-align: center;
                  margin: 0 15px;
                  min-width: 200px;
                }
                .cnpj-container {
                  text-align: right;
                  flex: 0 0 auto;
                }
                h1 {
                  font-size: 20pt;
                  color: white;
                  margin: 0 0 5px 0;
                  font-weight: 600;
                  letter-spacing: 0.5px;
                }
                .header-info {
                  font-size: 9pt;
                  color: rgba(255,255,255,0.9);
                  margin: 0;
                  font-weight: 300;
                }
                .section {
                  border-bottom: 1px solid #e0e0e0;
                  padding-bottom: 15px;
                  margin-bottom: 20px;
                }
                .section:last-child {
                  border-bottom: none;
                  margin-bottom: 0;
                }
                .section-title {
                  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                  color: #007bff;
                  padding: 8px 12px;
                  border-radius: 6px;
                  font-size: 12pt;
                  font-weight: 500;
                  margin-bottom: 15px;
                  border-left: 4px solid #007bff;
                  box-shadow: 0 2px 4px rgba(0,123,255,0.1);
                }
                p {
                  margin: 8px 0;
                  font-size: 11pt;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  word-wrap: break-word;
                }
                p i {
                  width: 18px;
                  text-align: center;
                  color: #007bff;
                  font-size: 12pt;
                }
                .print-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px 0;
                  border: 1px solid #007bff;
                  border-radius: 6px;
                  overflow: hidden;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                }
                .print-table th, .print-table td {
                  border: 1px solid #007bff;
                  padding: 10px 8px;
                  text-align: left;
                  font-size: 10pt;
                }
                .print-table th {
                  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                  color: white;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                .print-table td {
                  background: #f8f9fa;
                }
                .print-table tr:nth-child(even) td {
                  background: #e9ecef;
                }
                .print-table tr:hover td {
                  background: #e3f2fd;
                }
                .print-summary {
                  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                  padding: 20px;
                  border-radius: 8px;
                  margin: 20px 0;
                  border-left: 4px solid #007bff;
                  box-shadow: 0 2px 8px rgba(0,123,255,0.1);
                }
                .print-summary p {
                  justify-content: space-between;
                  font-size: 11pt;
                  margin: 10px 0;
                  font-weight: 500;
                  border-bottom: 1px dashed #007bff;
                  padding-bottom: 5px;
                }
                .print-summary p:last-child {
                  border-bottom: none;
                }
                .print-summary .final-price {
                  font-size: 13pt;
                  color: #007bff;
                  border-top: 2px solid #007bff;
                  padding-top: 10px;
                  margin-top: 10px;
                  font-weight: 700;
                  text-align: center;
                }
                .print-summary .discount-info {
                  color: #dc3545;
                  font-weight: bold;
                  text-align: center;
                  margin-top: 5px;
                }
                .print-warning {
                  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                  border: 2px solid #ffc107;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 25px 0;
                  color: #856404;
                  font-size: 10pt;
                  line-height: 1.4;
                  box-shadow: 0 2px 6px rgba(255,193,7,0.2);
                }
                .print-warning .warning-title {
                  font-weight: 700;
                  color: #d39e00;
                  margin-bottom: 12px;
                  text-align: center;
                  font-size: 12pt;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .print-footer {
                  text-align: center;
                  color: #6c757d;
                  font-size: 9pt;
                  margin-top: 25px;
                  border-top: 1px solid #dee2e6;
                  padding-top: 15px;
                  font-style: italic;
                }
                .print-footer p {
                  margin: 8px 0;
                  justify-content: center;
                  display: flex;
                  align-items: center;
                  gap: 5px;
                }
                .maps-link {
                  color: #007bff;
                  text-decoration: underline;
                  font-size: 10pt;
                  transition: color 0.3s ease;
                }
                .maps-link:hover {
                  color: #0056b3;
                }
                .discount-line {
                  font-weight: bold;
                  color: #dc3545;
                }
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    font-size: 11pt;
                  }
                  .print-table {
                    border-collapse: collapse;
                    box-shadow: none;
                  }
                  .print-container {
                    box-shadow: none;
                    border: 1px solid #000;
                  }
                  .print-header {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                  .print-warning {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                }
                @media (max-width: 640px) {
                  .print-table {
                    font-size: 9pt;
                    width: 100%;
                  }
                  .print-table td:before {
                    content: attr(data-label) ": ";
                    font-weight: bold;
                    display: block;
                  }
                  .print-table td {
                    border: none;
                    border-bottom: 1px solid #007bff;
                    padding: 5px;
                  }
                  .header-container {
                    flex-direction: column;
                    gap: 10px;
                  }
                  .title-container {
                    order: -1;
                    margin: 0;
                  }
                }
              </style>
            </head>
            <body onload="setTimeout(() => window.print(), 1000)">
              <div class="print-container">
                <div class="print-header">
                  <div class="header-container">
                    <div class="logo-container">
                      ${logoBase64 ? `<img src="${logoBase64}" alt="Logo SESI">` : ''}
                    </div>
                    <div class="title-container">
                      <h1>${title}</h1>
                    </div>
                    <div class="cnpj-container">
                      <p class="header-info">CNPJ: ${cnpj}</p>
                    </div>
                  </div>
                </div>
                <div class="section">
                  <div class="section-title">Informações Gerais</div>
                  <p><i class="fas fa-calendar-alt"></i><span>Gerado em:</span> <span>${generatedDate}</span></p>
                  <p><i class="fas fa-user"></i><span>Responsável pelo Orçamento:</span> <span>${schedulerName}</span></p>
                  <p><i class="fas fa-user-md"></i><span>Cliente:</span> <span>${apt.patient || 'Não informado'}</span></p>
                  <p><i class="fas fa-phone"></i><span>Telefone do Cliente:</span> <span>${apt.phone || 'Não informado'}</span></p>
        `;
        if (apt.agendaType === 'Agenda de Exames') {
            printContent += `
                  <div class="section">
                    <div class="section-title">Exames Selecionados</div>
                    <table class="print-table">
                      <thead>
                        <tr>
                          <th>Exame</th>
                          <th>Valor Original (R$)</th>
                          <th>Desconto Indústria (%)</th>
                          <th>Desconto Promocional (%)</th>
                          <th>Valor Final (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-label="Exame">${apt.professional || 'Não informado'}</td>
                          <td data-label="Valor Original (R$)">${originalPrice.toFixed(2)}</td>
                          <td data-label="Desconto Indústria (%)">${apt.discount && apt.discount.industry ? apt.discount.industry : '0'}</td>
                          <td data-label="Desconto Promocional (%)">${apt.discount && apt.discount.promotional ? apt.discount.promotional : '0'}</td>
                          <td data-label="Valor Final (R$)">${discountedPrice.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="print-summary">
                    <p><i class="fas fa-calculator"></i><span>Valor Total Original:</span> <span>R$ ${originalPrice.toFixed(2)}</span></p>
                    ${industryDiscountLine ? `<p class="discount-line"><i class="fas fa-industry"></i><span>${industryDiscountLine}:</span> <span>R$ ${industryAmount.toFixed(2)}</span></p>` : ''}
                    ${promotionalDiscountLine ? `<p class="discount-line"><i class="fas fa-tag"></i><span>${promotionalDiscountLine}:</span> <span>R$ ${promotionalAmount.toFixed(2)}</span></p>` : ''}
                    ${promotionalPeriodLine ? `<p class="discount-line"><i class="fas fa-calendar-alt"></i><span>${promotionalPeriodLine}:</span></p>` : ''}
                    <p class="final-price"><i class="fas fa-receipt"></i><span>Total do Pagamento:</span> <span>R$ ${discountedPrice.toFixed(2)}</span></p>
                  </div>
                  ${apt.observations ? `
                  <div class="section">
                    <div class="section-title">Observações</div>
                    <p><i class="fas fa-sticky-note"></i><span>${sanitizeInput(apt.observations)}</span></p>
                  </div>
                  ` : ''}
            `;
        } else if (apt.agendaType === 'Agenda Odontológica') {
            printContent += `
                  <div class="section">
                    <div class="section-title">Detalhes do Agendamento</div>
                    <p><i class="fas fa-calendar-day"></i><span>Data:</span> <span>${apt.date || ''}</span></p>
                    <p><i class="fas fa-clock"></i><span>Horário:</span> <span>${apt.time || ''}</span></p>
                    <p><i class="fas fa-user-md"></i><span>Profissional:</span> <span>${apt.professional || ''}</span></p>
                    <p><i class="fas fa-stethoscope"></i><span>Tipo:</span> <span>${apt.agendaType || ''}</span></p>
                    <p><i class="fas fa-map-marker-alt"></i><span>Local:</span> <span>${apt.location || ''}</span></p>
                    ${apt.priority ? `<p><i class="fas fa-exclamation-triangle"></i><span>Prioritário:</span> <span>${apt.priority}</span></p>` : ''}
                    ${apt.firstAppointment ? `<p><i class="fas fa-star"></i><span>1º Atendimento.:</span> <span>${apt.firstAppointment}</span></p>` : ''}
                    ${apt.observations ? `<p><i class="fas fa-sticky-note"></i><span>Obs.:</span> <span>${sanitizeInput(apt.observations)}</span></p>` : ''}
                  </div>
            `;
        } else {
            printContent += `
                  <div class="section">
                    <div class="section-title">Detalhes do Agendamento</div>
                    <p><i class="fas fa-calendar-day"></i><span>Data:</span> <span>${apt.date || ''}</span></p>
                    <p><i class="fas fa-clock"></i><span>Horário:</span> <span>${apt.time || ''}</span></p>
                    <p><i class="fas fa-user-md"></i><span>Profissional:</span> <span>${apt.professional || ''}</span></p>
                    <p><i class="fas fa-stethoscope"></i><span>Tipo:</span> <span>${apt.agendaType || ''}</span></p>
                    <p><i class="fas fa-map-marker-alt"></i><span>Local:</span> <span>${apt.location || ''}</span></p>
                    ${apt.priority ? `<p><i class="fas fa-exclamation-triangle"></i><span>Prioritário:</span> <span>${apt.priority}</span></p>` : ''}
                    ${apt.firstAppointment ? `<p><i class="fas fa-star"></i><span>1º Atendimento.:</span> <span>${apt.firstAppointment}</span></p>` : ''}
                    <p><i class="fas fa-tag"></i><span>Valor Original:</span> <span>R$ ${originalPrice.toFixed(2)}</span></p>
                    ${industryDiscountLine ? `<p class="discount-line"><i class="fas fa-industry"></i><span>${industryDiscountLine}:</span> <span>R$ ${industryAmount.toFixed(2)}</span></p>` : ''}
                    ${promotionalDiscountLine ? `<p class="discount-line"><i class="fas fa-tag"></i><span>${promotionalDiscountLine}:</span> <span>R$ ${promotionalAmount.toFixed(2)}</span></p>` : ''}
                    ${promotionalPeriodLine ? `<p class="discount-line"><i class="fas fa-calendar-alt"></i><span>${promotionalPeriodLine}:</span></p>` : ''}
                    <p><i class="fas fa-receipt"></i><span>Valor Final:</span> <span>R$ ${discountedPrice.toFixed(2)}</span></p>
                    ${apt.observations ? `<p><i class="fas fa-sticky-note"></i><span>Obs.:</span> <span>${sanitizeInput(apt.observations)}</span></p>` : ''}
                  </div>
            `;
        }
        printContent += `
                </div>
                <div class="print-warning">
                  <div class="warning-title">! AVISO IMPORTANTE !</div>
                  <div>Ao solicitar o agendamento de exames laboratoriais e especialidades médicas, o cliente declara expressamente que autoriza o tratamento dos seus dados pessoais de nome, telefone e CPF, para essa finalidade específica. Neste orçamento, possui validade a partir da data de sua solicitação até o término do ano corrente (2025). Durante esse período, os valores poderão ser atualizados, inclusive em razão de campanhas promocionais ou ajustes de tabela. Caso o atendimento seja confirmado em data posterior ao prazo de validade ou em período com novas condições comerciais, o cliente será previamente informado sobre eventuais alterações nos preços antes da confirmação do atendimento.</div>
                </div>
                <div class="print-footer">
                  <p><i class="fas fa-map-marker-alt"></i><span>Endereço:</span> <span><a href="${mapsUrl}" class="maps-link" target="_blank">${address}</a></span></p>
                  <p><i class="fas fa-calendar-alt"></i><span>Data:</span> <span>${generatedDate}</span></p>
                </div>
              </div>
            </body>
            </html>
        `;
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    }
    showToast(`Comprovante ${isThermal ? 'térmica' : 'normal'} gerado com sucesso!`, 'success');
}
function showPrintTypeModal() {
    closeModal('printConfirmModal');
    document.getElementById('printTypeModal').style.display = 'block';
    document.querySelector('input[name="printType"]').focus();
}
function generatePrintPDF() {
    const printType = document.querySelector('input[name="printType"]:checked').value;
    generatePDF(currentPrintId, printType);
    closeModal('printTypeModal');
    if (justScheduled) {
        setTimeout(() => {
            justScheduled = false;
            window.location.reload();
        }, 2000);
    }
}
function preparePrint(id) {
    currentPrintId = id;
    document.getElementById('printConfirmModal').style.display = 'block';
}
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const toggleBtn = document.querySelector('.theme-toggle');
    toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-checked', newTheme === 'dark' ? 'true' : 'false');
}
function confirmOpenFicha(cpf, patient = '', phone = '', observations = '') {
    if (confirm('Deseja abrir o arquivo da ficha clínica?')) {
        const sanitizedPatient = encodeURIComponent(sanitizeInput(patient));
        const sanitizedPhone = encodeURIComponent(sanitizeInput(phone));
        const sanitizedObs = encodeURIComponent(sanitizeInput(observations));
        const fichaUrl = `https://pesenaibr-my.sharepoint.com/:w:/g/personal/socrates_silva_sistemafiepe_org_br/EezX1v19-BBDl9cKn3fKqgcB_lCc-cVTcpZi26gErPTlDw?e=5DVI2m&cpf=${encodeURIComponent(cpf || '')}&name=${sanitizedPatient}&phone=${sanitizedPhone}&obs=${sanitizedObs}`;
        window.open(fichaUrl, '_blank');
    }
}
function showPatientHistory(cpf, patientName) {
    currentPatientCpf = cpf;
    const patientAppointments = appointments.filter(apt => apt.cpf === cpf);
    if (patientAppointments.length === 0) {
        showToast('Nenhum histórico encontrado para este paciente.', 'error');
        return;
    }
    patientAppointments.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB - dateA;
    });
    currentPatientName = patientName || patientAppointments[0].patient;
    currentPatientDate = patientAppointments[0].date;
    const modal = document.getElementById('patientHistoryModal');
    const title = document.getElementById('historyTitle');
    const info = document.getElementById('historyPatientInfo');
    const list = document.getElementById('historyList');
    title.textContent = `Histórico de Atendimentos - ${currentPatientName}`;
    info.innerHTML = `<strong>Nome Completo:</strong> ${currentPatientName}<br><strong>CPF:</strong> ${cpf} | <strong>Total de Atendimentos:</strong> ${patientAppointments.length}`;
    list.innerHTML = '';
    patientAppointments.forEach(apt => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const statusClass = getStatusClass(apt.status);
        item.innerHTML = `
            <p><strong>Data:</strong> ${apt.date} | <strong>Horário:</strong> ${apt.time}</p>
            <p><strong>Tipo:</strong> ${apt.agendaType} | <strong>Profissional:</strong> ${sanitizeInput(apt.professional)}</p>
            <p><strong>Status:</strong> <span class="status ${statusClass}">${getStatusText(apt.status)}</span></p>
            ${apt.observations ? `<p><strong>Observações:</strong> ${sanitizeInput(apt.observations)}</p>` : ''}
        `;
        list.appendChild(item);
    });
    modal.style.display = 'block';
    focusTrap(modal);
}
function generateAttendanceDeclarationForAppointment(id) {
    currentDeclarationId = id;
    const apt = appointments.find(a => a.id === id);
    if (!apt) {
        showToast('Agendamento não encontrado.', 'error');
        return;
    }
    document.getElementById('declarationPatientInfo').innerHTML = `<strong>Paciente:</strong> ${sanitizeInput(apt.patient)}<br><strong>CPF:</strong> ${apt.cpf || 'Não informado'}<br><strong>Data do Atendimento:</strong> ${apt.date}`;
    document.getElementById('entryTime').value = '';
    document.getElementById('declarationTimeModal').style.display = 'block';
    document.getElementById('entryTime').focus();
    focusTrap(document.getElementById('declarationTimeModal'));
}
function openDeclarationTimeModal() {
    document.getElementById('declarationTimeModal').style.display = 'block';
    document.getElementById('entryTime').focus();
    focusTrap(document.getElementById('declarationTimeModal'));
}
function confirmDeclarationTime() {
    const entryTime = document.getElementById('entryTime').value;
    if (!entryTime) {
        showToast('Informe o horário de entrada do trabalhador.', 'error');
        return;
    }
    const apt = appointments.find(a => a.id === currentDeclarationId);
    if (!apt) {
        showToast('Agendamento não encontrado.', 'error');
        return;
    }
    generateAttendanceDeclaration(apt.cpf, apt.patient, entryTime);
    closeModal('declarationTimeModal');
    currentDeclarationId = null;
}
async function generateAttendanceDeclaration(cpf, patientName, entryTime) {
    const declDate = new Date().toLocaleDateString('pt-BR');
    const declTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const entryTimeFormatted = new Date(`2000-01-01T${entryTime}`).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const printContent = `
        <html>
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <title>Declaração de Comparecimento</title>
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              font-family: 'Roboto', serif;
              font-size: 12pt;
              margin: 0;
              padding: 0;
              line-height: 1.6;
              color: #000;
              background: white;
              text-align: center;
              width: 100%;
            }
            .print-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 2px solid #007bff;
              border-radius: 8px;
              background: #ffffff;
            }
            .print-header {
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #007bff;
              padding-bottom: 15px;
              gap: 20px;
            }
            .header-logo {
              max-width: 125px;
              height: auto;
              margin: 0;
              flex-shrink: 0;
            }
            .header-text {
              flex: 1;
              text-align: center;
            }
            h1 {
              color: #007bff;
              font-size: 18pt;
              margin: 0 0 10px 0;
              font-weight: bold;
            }
            .declaration-body {
              text-align: center;
              margin-bottom: 20px;
            }
            .declaration-body p {
              margin-bottom: 15px;
              text-indent: 0;
            }
            .signature-section {
              display: flex;
              justify-content: flex-start;
              margin-top: 40px;
            }
            .signature-box {
              border-bottom: 1px solid #000;
              width: 100%;
              padding-top: 50px;
              text-align: left;
              font-size: 10pt;
              color: #666;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 10pt;
              color: #666;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body onload="setTimeout(() => window.print(), 1000)">
          <div class="print-container">
            <div class="print-header">
              <div style="display: flex; align-items: center; justify-content: center; width: 100%; gap: 20px;">
                ${coloredLogoBase64 ? `<img src="${coloredLogoBase64}" alt="Logo SESI Saúde" class="header-logo">` : ''}
                <div class="header-text">
                  <h1>Declaração de Comparecimento</h1>
                  <p>SERVIÇO SOCIAL DA INDÚSTRIA - SESI SAÚDE</p>
                  <p>CNPJ: 03.910.210/0002-52</p>
                </div>
              </div>
            </div>
            <div class="declaration-body">
              <p>Eu, <strong>${sanitizeInput(patientName)}</strong>, portador(a) do CPF <strong>${cpf}</strong>, declaro para os devidos fins que compareci ao atendimento no SESI Saúde no horário de entrada <strong>${entryTimeFormatted}</strong>, tendo o atendimento realizado na data de <strong>${declDate}</strong>.</p>
              <p>O atendimento foi realizado conforme agendamento prévio, e não houve qualquer impedimento ou irregularidade que pudesse comprometer a qualidade do serviço prestado.</p>
              <p>Esta declaração serve como comprovação de presença e comparecimento ao local e horário designados.</p>
              <p>Local e Data: Recife/PE, ${declDate} às ${declTime}.</p>
            </div>
            <div class="signature-section">
              <div class="signature-box">
                Assinatura e Carimbo do Responsável:<br>
                ________________________________________
              </div>
            </div>
            <div class="footer">
              <p>Documento gerado automaticamente pelo Agendamento SESI Saúde.</p>
              <p>Validade: Única emissão.</p>
            </div>
          </div>
        </body>
        </html>
    `;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 1000);
    showToast('Declaração de Comparecimento gerada e aberta para impressão!', 'success');
}
function generateCalendar(agendaType = currentAgendaType) {
    const calendar = document.getElementById('calendar');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date(2025, 10, 6); // Data fixa para consistência
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    calendar.innerHTML = `
        <div class="day-header">dom</div>
        <div class="day-header">seg</div>
        <div class="day-header">ter</div>
        <div class="day-header">qua</div>
        <div class="day-header">qui</div>
        <div class="day-header">sex</div>
        <div class="day-header">sáb</div>
    `;
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = date.getDate();
        dayElement.setAttribute('role', 'gridcell');
        dayElement.setAttribute('tabindex', '0');
        dayElement.setAttribute('aria-label', `Dia ${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })}`);
        if (date.getMonth() !== month) {
            dayElement.classList.add('other-month');
        } else {
            const dayOfWeek = date.getDay();
            const dateStr = date.toLocaleDateString('pt-BR');
            const dateYYYY = formatDateToYYYYMMDD(date);
            const isHolidayDay = isHoliday(date);
            const isBlockedDay = agendaType ? isBlocked(dateStr, agendaType) : false;
     
            // LÓGICA ATUALIZADA: Verifica disponibilidade na Gestão da Agenda (global ou custom para prof selecionado)
            let hasEnabledPeriods = false;
            const selectedProf = document.getElementById('dentistSelect').value; // Prof atual, se selecionado
            let schedule;
            if (agendaType && agendaSchedules[agendaType]) {
                if (selectedProf && agendaSchedules[agendaType].custom && agendaSchedules[agendaType].custom[selectedProf]) {
                    schedule = agendaSchedules[agendaType].custom[selectedProf];
                } else {
                    schedule = agendaSchedules[agendaType].global;
                }
                const daySchedule = schedule?.[dayOfWeek];
                if (daySchedule) {
                    hasEnabledPeriods = daySchedule.periods.some(p => p.enabled && p.start && p.end);
                }
            }
     
            const slots = hasEnabledPeriods ? generateSlotsForDay(agendaType || 'Agenda Especialidades Médicas', dayOfWeek, selectedProf) : [];
            const isProfBlocked = selectedProf ? isProfessionalBlockedOnDate(selectedProf, agendaType, dateYYYY) : false;
            const isUnavailableBase = dayOfWeek === 0 || dayOfWeek === 6 || isHolidayDay || date < today || isBlockedDay || !hasEnabledPeriods || slots.length === 0 || isProfBlocked;
     
            if (isUnavailableBase) {
                dayElement.classList.add('unavailable');
                // ATUALIZAÇÃO: Classe específica para dias sem trabalho (cinza claro) e tooltip explicativo
                if (!hasEnabledPeriods) {
                    dayElement.classList.add('non-working-day'); // Nova classe para cinza claro visível
                    dayElement.title = selectedProf
                        ? `Profissional ${selectedProf} não atende neste dia da semana em ${agendaType}. Verifique a Gestão da Agenda.`
                        : `Dia não disponível na agenda para ${agendaType || 'o tipo selecionado'}. Verifique a Gestão da Agenda.`;
                    dayElement.setAttribute('aria-label', `${dayElement.getAttribute('aria-label')} - Profissional não atende neste dia (desabilitado)`);
                } else if (isProfBlocked) {
                    dayElement.classList.add('blocked');
                    const blockReason = blockedProfessionals.find(bp => bp.professional === selectedProf && bp.agendaType === agendaType && dateYYYY >= bp.startDate && dateYYYY <= bp.endDate)?.reason || 'Bloqueio de profissional';
                    dayElement.title = `Profissional ${selectedProf} bloqueado nesta data para ${agendaType}: ${blockReason}`;
                    dayElement.setAttribute('aria-label', `Profissional ${selectedProf} bloqueado nesta data para ${agendaType}: ${blockReason} - ${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })}`);
                } else if (isHolidayDay) {
                    dayElement.classList.add('holiday');
                    dayElement.title = getHolidayName(date);
                    dayElement.setAttribute('aria-label', `Feriado: ${getHolidayName(date)} - ${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })}`);
                } else if (isBlockedDay) {
                    dayElement.classList.add('blocked');
                    const blockReason = agendaType ? blockedDates.find(b => b.date === dateStr && b.agendaType === agendaType)?.reason : null;
                    dayElement.title = `Data bloqueada para ${agendaType}: ${blockReason}`;
                    dayElement.setAttribute('aria-label', `Data bloqueada para ${agendaType}: ${blockReason} - ${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })}`);
                } else if (slots.length === 0) {
                    dayElement.title = `Sem disponibilidade para ${agendaType} neste dia da semana.`;
                    dayElement.setAttribute('aria-label', `Sem disponibilidade para ${agendaType} neste dia da semana - ${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })}`);
                }
                dayElement.setAttribute('aria-disabled', 'true');
                dayElement.onclick = null;
                dayElement.onkeydown = null;
            } else {
                dayElement.onclick = () => selectDay(date);
                dayElement.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') selectDay(date); };
                if (date.toDateString() === today.toDateString()) {
                    dayElement.style.background = '#ffc107';
                    dayElement.style.color = '#000';
                    dayElement.setAttribute('aria-label', `Hoje: ${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })}`);
                }
            }
            const hasAppointment = appointmentDatesSet.has(date.toDateString());
            if (hasAppointment) {
                dayElement.classList.add('has-appointment');
                dayElement.setAttribute('aria-label', `${dayElement.getAttribute('aria-label')} - Possui agendamento`);
            }
        }
        calendar.appendChild(dayElement);
    }
    document.getElementById('monthDisplay').textContent = firstDay.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}
// Updated selectDay function to prevent selection on non-working days and show explanatory toast
function selectDay(date, dayElement = null) {
    if (isHoliday(date)) {
        showToast(`Não é possível selecionar feriados: ${getHolidayName(date)}`, 'error');
        return;
    }
    const dateStr = date.toLocaleDateString('pt-BR');
    const dateYYYY = formatDateToYYYYMMDD(date);
    const selectedAgendaType = document.getElementById('agendaTypeSelect').value;
    if (selectedAgendaType && isBlocked(dateStr, selectedAgendaType)) {
        const reason = blockedDates.find(b => b.date === dateStr && b.agendaType === selectedAgendaType)?.reason;
        showToast(`Data bloqueada para ${selectedAgendaType}: ${reason}`, 'error');
        return;
    }
    const selectedProf = document.getElementById('dentistSelect').value;
    if (selectedProf && selectedAgendaType && isProfessionalBlockedOnDate(selectedProf, selectedAgendaType, dateYYYY)) {
        const block = blockedProfessionals.find(bp => bp.professional === selectedProf && bp.agendaType === selectedAgendaType && dateYYYY >= bp.startDate && dateYYYY <= bp.endDate);
        showToast(`Profissional ${selectedProf} bloqueado nesta data para ${selectedAgendaType}: ${block?.reason || 'Bloqueio de profissional'}`, 'error');
        return;
    }
    // ATUALIZAÇÃO: Valida enabled periods na Gestão da Agenda para impedir seleção
    const dayOfWeek = date.getDay();
    let hasEnabledPeriods = false;
    if (selectedAgendaType && agendaSchedules[selectedAgendaType]) {
        let schedule;
        if (selectedProf && agendaSchedules[selectedAgendaType].custom && agendaSchedules[selectedAgendaType].custom[selectedProf]) {
            schedule = agendaSchedules[selectedAgendaType].custom[selectedProf];
        } else {
            schedule = agendaSchedules[selectedAgendaType].global;
        }
        const daySchedule = schedule?.[dayOfWeek];
        if (daySchedule) {
            hasEnabledPeriods = daySchedule.periods.some(p => p.enabled && p.start && p.end);
        }
    }
    if (!hasEnabledPeriods) {
        const profMsg = selectedProf ? `Profissional ${selectedProf}` : 'a agenda';
        showToast(`${profMsg} não atende neste dia da semana em ${selectedAgendaType}. Verifique a Gestão da Agenda para ativar períodos.`, 'error');
        return;
    }
    const slots = generateSlotsForDay(selectedAgendaType || 'Agenda Especialidades Médicas', dayOfWeek, selectedProf);
    if (selectedAgendaType && slots.length === 0) {
        showToast(`Sem disponibilidade para ${selectedAgendaType} neste dia da semana.`, 'error');
        return;
    }
            selectedDay = date;
            if (dayElement) {
                dayElement.classList.add('selected');
            } else {
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                const days = document.querySelectorAll('.day');
                for (let d of days) {
                    const dayNum = parseInt(d.textContent);
                    if (!isNaN(dayNum)) {
                        const testDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                        if (testDate.toDateString() === date.toDateString()) {
                            d.classList.add('selected');
                            break;
                        }
                    }
                }
            }
            document.getElementById('selectedDate').style.display = 'block';
            document.getElementById('selectedDateText').textContent = `${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })} de ${date.getFullYear()}`;
            document.getElementById('sectionButtons').style.display = 'flex';
            document.getElementById('blockDateBtn').disabled = false;
            updateScheduleButton();
            populateHours(date);
        }
        function autoSelectToday() {
            const today = new Date(2025, 10, 6); // Data fixa
            const days = document.querySelectorAll('.day');
            for (let day of days) {
                const dayNum = parseInt(day.textContent);
                if (!isNaN(dayNum)) {
                    const testDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                    if (testDate.toDateString() === today.toDateString() && testDate.getMonth() === currentDate.getMonth()) {
                        const dayOfWeek = testDate.getDay();
                        const dateStr = testDate.toLocaleDateString('pt-BR');
                        const isHolidayDay = isHoliday(testDate);
                        const selectedAgendaType = document.getElementById('agendaTypeSelect').value;
                        const isBlockedDay = selectedAgendaType ? isBlocked(dateStr, selectedAgendaType) : false;
                        const slots = generateSlotsForDay(selectedAgendaType || 'Agenda Especialidades Médicas', dayOfWeek);
                        const isUnavailable = dayOfWeek === 0 || dayOfWeek === 6 || isHolidayDay || testDate < today || isBlockedDay || slots.length === 0;
                        if (!isUnavailable) {
                            selectDay(testDate, day);
                            day.focus();
                            return;
                        }
                    }
                }
            }
            console.log('Hoje não é selecionável (fim de semana, feriado ou bloqueado).');
        }
        function blockSelectedDate() {
            if (!selectedDay) {
                showToast('Selecione uma data primeiro.', 'error');
                return;
            }
            const dateStr = selectedDay.toLocaleDateString('pt-BR');
            const selectedAgendaType = document.getElementById('agendaTypeSelect').value;
            if (selectedAgendaType && isBlocked(dateStr, selectedAgendaType)) {
                showToast(`Esta data já está bloqueada para ${selectedAgendaType}.`, 'error');
                return;
            }
            const hasAppointment = appointmentDatesSet.has(selectedDay.toDateString());
            if (hasAppointment) {
                if (!confirm(`Esta data possui agendamentos existentes. Deseja realmente bloquear a data "${dateStr}"? Isso impedirá novos agendamentos, mas os existentes permanecerão até serem editados ou excluídos manualmente.`)) {
                    return;
                }
            }
            document.getElementById('blockDateText').textContent = dateStr;
            const blockAgendaTypeSelect = document.getElementById('blockAgendaType');
            blockAgendaTypeSelect.innerHTML = '<option value="">Selecione o tipo de agenda</option>';
            agendaTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                if (selectedAgendaType === type) {
                    option.selected = true;
                }
                blockAgendaTypeSelect.appendChild(option);
            });
            document.getElementById('blockReason').value = '';
            document.getElementById('blockModal').style.display = 'block';
            document.getElementById('blockAgendaType').focus();
        }
        function blockSelectedProfessional() {
            const blockProfessionalAgendaTypeSelect = document.getElementById('blockProfessionalAgendaType');
            blockProfessionalAgendaTypeSelect.innerHTML = '<option value="">Selecione o tipo de agenda</option>';
            agendaTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                blockProfessionalAgendaTypeSelect.appendChild(option);
            });
            document.getElementById('blockProfessionalSelect').innerHTML = '<option value="">Selecione o profissional</option>';
            document.getElementById('blockProfessionalReason').value = '';
            document.getElementById('blockProfessionalStartDate').value = '';
            document.getElementById('blockProfessionalEndDate').value = '';
            document.getElementById('blockProfessionalModal').style.display = 'block';
            document.getElementById('blockProfessionalAgendaType').focus();
        }
        function confirmBlock() {
            const agendaType = document.getElementById('blockAgendaType').value.trim();
            const reason = document.getElementById('blockReason').value.trim();
            if (!agendaType) {
                showToast('Selecione o tipo de agenda para o bloqueio.', 'error');
                return;
            }
            if (!reason) {
                showToast('Informe o motivo do bloqueio.', 'error');
                return;
            }
            const dateStr = selectedDay.toLocaleDateString('pt-BR');
            blockedDates.push({ date: dateStr, agendaType: agendaType, reason: sanitizeInput(reason) });
            localStorage.setItem('blockedDates', JSON.stringify(blockedDates));
            blockedDates = JSON.parse(localStorage.getItem('blockedDates')) || [];
            closeModal('blockModal');
            showToast(`Data bloqueada com sucesso para ${agendaType}! 🔒`);
            toggleBlocked();
            generateCalendar(currentAgendaType);
            clearCalendarSelections();
        }
        function confirmBlockProfessional() {
            const agendaType = document.getElementById('blockProfessionalAgendaType').value.trim();
            const professional = document.getElementById('blockProfessionalSelect').value.trim();
            const startDate = document.getElementById('blockProfessionalStartDate').value;
            const endDate = document.getElementById('blockProfessionalEndDate').value;
            const reason = document.getElementById('blockProfessionalReason').value.trim();
            if (!agendaType || !professional || !startDate || !endDate || !reason) {
                showToast('Preencha todos os campos obrigatórios.', 'error');
                return;
            }
            if (new Date(startDate) > new Date(endDate)) {
                showToast('A data de início não pode ser posterior à data de fim.', 'error');
                return;
            }
            if (isProfessionalBlocked(professional, agendaType)) {
                showToast(`Este profissional já está bloqueado para ${agendaType}.`, 'error');
                return;
            }
            blockedProfessionals.push({ professional, agendaType, startDate, endDate, reason: sanitizeInput(reason) });
            localStorage.setItem('blockedProfessionals', JSON.stringify(blockedProfessionals));
            blockedProfessionals = JSON.parse(localStorage.getItem('blockedProfessionals')) || [];
            closeModal('blockProfessionalModal');
            showToast(`Profissional ${professional} bloqueado com sucesso para ${agendaType} de ${startDate} a ${endDate}! 🔒`);
            populateProfessionals(currentAgendaType, 'dentistSelect');
            generateCalendar(currentAgendaType);
            if (document.getElementById('scheduledGrid').style.display !== 'none') {
                displayAppointments();
            }
        }
        function removeBlock(index) {
            if (confirm('Tem certeza que deseja remover este bloqueio?')) {
                blockedDates.splice(index, 1);
                localStorage.setItem('blockedDates', JSON.stringify(blockedDates));
                blockedDates = JSON.parse(localStorage.getItem('blockedDates')) || [];
                displayBlocked();
                generateCalendar(currentAgendaType);
                showToast('Bloqueio removido com sucesso! ✅');
            }
        }
        function removeProfessionalBlock(index) {
            if (confirm('Tem certeza que deseja remover este bloqueio de profissional?')) {
                blockedProfessionals.splice(index, 1);
                localStorage.setItem('blockedProfessionals', JSON.stringify(blockedProfessionals));
                blockedProfessionals = JSON.parse(localStorage.getItem('blockedProfessionals')) || [];
                displayBlocked();
                populateProfessionals(currentAgendaType, 'dentistSelect');
                generateCalendar(currentAgendaType);
                showToast('Bloqueio de profissional removido com sucesso! ✅');
            }
        }
        function toggleBlocked() {
            const grid = document.getElementById('blockedGrid');
            const btn = document.getElementById('toggleBlockedBtn');
            if (grid.style.display === 'none' || grid.style.display === '') {
                grid.style.display = 'grid';
                grid.classList.add('show');
                btn.textContent = 'Ocultar Datas Bloqueadas';
                isBlockedSectionOpen = true;
                displayBlocked();
            } else {
                grid.style.display = 'none';
                grid.classList.remove('show');
                btn.textContent = 'Mostrar Datas Bloqueadas';
                isBlockedSectionOpen = false;
            }
        }
        function displayBlocked() {
            const list = document.getElementById('blockedList');
            const summary = document.getElementById('blockedSummary');
            list.innerHTML = '';
            blockedDates.sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-'));
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return dateB - dateA;
            });
            blockedProfessionals.sort((a, b) => a.agendaType.localeCompare(b.agendaType) || a.professional.localeCompare(b.professional));
            if (blockedDates.length === 0 && blockedProfessionals.length === 0) {
                list.innerHTML = '<p class="empty-message">Nenhuma data ou profissional bloqueado.</p>';
                summary.style.display = 'none';
                return;
            }
            const countOdontoDates = blockedDates.filter(b => b.agendaType === 'Agenda Odontológica').length;
            const countMedicasDates = blockedDates.filter(b => b.agendaType === 'Agenda Especialidades Médicas').length;
            const countExamesDates = blockedDates.filter(b => b.agendaType === 'Agenda de Exames').length;
            const countOdontoProfs = blockedProfessionals.filter(b => b.agendaType === 'Agenda Odontológica').length;
            const countMedicasProfs = blockedProfessionals.filter(b => b.agendaType === 'Agenda Especialidades Médicas').length;
            const countExamesProfs = blockedProfessionals.filter(b => b.agendaType === 'Agenda de Exames').length;
            summary.style.display = 'flex';
            summary.innerHTML = `
                <div class="blocked-summary-item">
                    <h4>🦷 Odontológica (Datas)</h4>
                    <p>${countOdontoDates}</p>
                </div>
                <div class="blocked-summary-item">
                    <h4>🏥 Médicas (Datas)</h4>
                    <p>${countMedicasDates}</p>
                </div>
                <div class="blocked-summary-item">
                    <h4>🔬 Exames (Datas)</h4>
                    <p>${countExamesDates}</p>
                </div>
                <div class="blocked-summary-item">
                    <h4>🦷 Odontológica (Profs)</h4>
                    <p>${countOdontoProfs}</p>
                </div>
                <div class="blocked-summary-item">
                    <h4>🏥 Médicas (Profs)</h4>
                    <p>${countMedicasProfs}</p>
                </div>
                <div class="blocked-summary-item">
                    <h4>🔬 Exames (Profs)</h4>
                    <p>${countExamesProfs}</p>
                </div>
            `;
            blockedDates.forEach((block, index) => {
                const card = document.createElement('div');
                card.className = 'block-card';
                card.setAttribute('role', 'listitem');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', `Bloqueio em ${block.date} para ${block.agendaType}: ${block.reason}`);
                card.innerHTML = `
                    <div class="block-actions">
                        <button class="btn-delete" onclick="removeBlock(${index})" aria-label="Remover bloqueio desta data" role="button">Remover</button>
                    </div>
                    <h4>🔒 ${block.date} - ${block.agendaType} (Data)</h4>
                    <p>Motivo: ${sanitizeInput(block.reason)}</p>
                `;
                list.appendChild(card);
                setTimeout(() => card.classList.add('show'), index * 100);
            });
            blockedProfessionals.forEach((block, index) => {
                const cardIndex = blockedDates.length + index;
                const card = document.createElement('div');
                card.className = 'block-card';
                card.setAttribute('role', 'listitem');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', `Bloqueio de ${block.professional} para ${block.agendaType}: ${block.reason}`);
                card.innerHTML = `
                    <div class="block-actions">
                        <button class="btn-delete" onclick="removeProfessionalBlock(${index})" aria-label="Remover bloqueio deste profissional" role="button">Remover</button>
                    </div>
                    <h4>🔒 ${block.professional} - ${block.agendaType} (Profissional)</h4>
                    <p>Período: ${block.startDate} a ${block.endDate}</p>
                    <p>Motivo: ${sanitizeInput(block.reason)}</p>
                `;
                list.appendChild(card);
                setTimeout(() => card.classList.add('show'), cardIndex * 100);
            });
        }
        function populateHours(selectedDate) {
            const hoursGrid = document.getElementById('hoursGrid');
            hoursGrid.innerHTML = '';
            const dateStr = selectedDate.toLocaleDateString('pt-BR');
            const dateYYYY = formatDateToYYYYMMDD(selectedDate);
            const selectedAgendaType = document.getElementById('agendaTypeSelect').value;
            const selectedDentist = document.getElementById('dentistSelect').value;
            const dayOfWeek = selectedDate.getDay();
            if (selectedAgendaType && isBlocked(dateStr, selectedAgendaType)) {
                const message = document.createElement('div');
                message.textContent = 'Esta data está bloqueada para o tipo de agenda selecionado. Nenhum horário disponível.';
                message.style.textAlign = 'center';
                message.style.padding = '20px';
                message.style.color = '#dc3545';
                message.style.fontWeight = 'bold';
                hoursGrid.appendChild(message);
                return;
            }
            if (selectedDentist && selectedAgendaType && isProfessionalBlockedOnDate(selectedDentist, selectedAgendaType, dateYYYY)) {
                const message = document.createElement('div');
                const blockReason = blockedProfessionals.find(bp => bp.professional === selectedDentist && bp.agendaType === selectedAgendaType && dateYYYY >= bp.startDate && dateYYYY <= bp.endDate)?.reason || 'Bloqueio de profissional';
                message.textContent = `Profissional ${selectedDentist} está bloqueado nesta data para ${selectedAgendaType}: ${blockReason}. Nenhum horário disponível.`;
                message.style.textAlign = 'center';
                message.style.padding = '20px';
                message.style.color = '#dc3545';
                message.style.fontWeight = 'bold';
                hoursGrid.appendChild(message);
                return;
            }
            let hours = getHoursFor(selectedAgendaType || 'Agenda Especialidades Médicas', dayOfWeek, selectedDentist);
            if (hours.length === 0) {
                const message = document.createElement('div');
                message.textContent = 'Sem disponibilidade para este tipo de agenda neste dia da semana.';
                message.style.textAlign = 'center';
                message.style.padding = '20px';
                message.style.color = '#ffc107';
                message.style.fontWeight = 'bold';
                hoursGrid.appendChild(message);
                return;
            }
            let bookedHours = [];
            if (selectedAgendaType && selectedDentist) {
                bookedHours = appointments
                    .filter(apt => apt.agendaType === selectedAgendaType && apt.date === dateStr && apt.professional === selectedDentist)
                    .map(apt => apt.time);
            } else if (selectedAgendaType) {
                bookedHours = appointments
                    .filter(apt => apt.agendaType === selectedAgendaType && apt.date === dateStr)
                    .map(apt => apt.time);
            } else {
                bookedHours = appointments
                    .filter(apt => apt.date === dateStr)
                    .map(apt => apt.time);
            }
            hours.forEach((hour, index) => {
                const slot = document.createElement('div');
                slot.className = 'hour-slot';
                slot.style.animationDelay = `${index * 0.1}s`;
                slot.setAttribute('role', 'gridcell');
                slot.setAttribute('tabindex', '0');
                slot.setAttribute('aria-label', `Horário ${hour}`);
                if (bookedHours.includes(hour)) {
                    slot.classList.add('booked');
                    const titleText = selectedDentist ? 'Horário já agendado para este profissional' : 'Horário ocupado';
                    slot.title = titleText;
                    slot.setAttribute('aria-disabled', 'true');
                    slot.setAttribute('aria-label', `Horário ${hour} - Ocupado`);
                    slot.onkeydown = null;
                    slot.onclick = (e) => {
                        e.preventDefault();
                        const alertText = selectedDentist ? 'Este horário já está agendado para este profissional.' : 'Este horário está ocupado.';
                        alert(alertText);
                    };
                } else {
                    slot.onclick = () => selectHour(hour);
                    slot.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') selectHour(hour); };
                }
                slot.textContent = hour;
                if (bookedHours.includes(hour)) {
                    const text = selectedDentist ? ' (Agendado)' : ' (Ocupado)';
                    slot.innerHTML += `<span style="font-size: 10px;">${text}</span>`;
                }
                hoursGrid.appendChild(slot);
            });
        }
        function selectHour(hour) {
            selectedHour = hour;
            document.querySelectorAll('.hour-slot:not(.booked)').forEach(s => s.classList.remove('selected'));
            event.target.classList.add('selected');
            updateScheduleButton();
        }
        function prevMonth() {
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentAgendaType);
            document.getElementById('selectedDate').style.display = 'none';
            clearCalendarSelections();
        }
        function nextMonth() {
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentAgendaType);
            document.getElementById('selectedDate').style.display = 'none';
            clearCalendarSelections();
        }
        function clearCalendarSelections() {
            selectedDay = null;
            selectedHour = null;
            document.querySelectorAll('.hour-slot').forEach(s => s.classList.remove('selected'));
            document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
            document.getElementById('hoursGrid').innerHTML = '';
            document.getElementById('selectedDate').style.display = 'none';
            document.getElementById('blockDateBtn').disabled = true;
            updateScheduleButton();
        }
        function resetToEmpty() {
            clearCalendarSelections();
            editingId = null;
            document.getElementById('scheduleBtn').textContent = 'Agendar Consulta';
            document.getElementById('patientName').value = '';
            document.getElementById('patientCpf').value = '';
            document.getElementById('patientPhone').value = '';
            document.getElementById('schedulerName').value = '';
            document.getElementById('observations').value = '';
            document.getElementById('locationSelect').value = '';
            document.getElementById('agendaTypeSelect').value = '';
            document.getElementById('dentistSelect').value = '';
            document.getElementById('prioritySelect').value = '';
            document.getElementById('firstAppointmentSelect').value = '';
            discountObj = {};
            document.getElementById('displayedDiscounts').style.display = 'none';
            currentAgendaType = '';
            updateScheduleButton();
            generateCalendar(currentAgendaType);
            document.getElementById('patientName').focus();
        }
        function debouncedFilterAppointments() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(filterAppointments, 300);
        }
        function clearOdontologiaFilters() {
            document.getElementById('odontologiaStartDate').value = '';
            document.getElementById('odontologiaEndDate').value = '';
            document.getElementById('odontologiaProfessional').value = '';
            document.getElementById('odontologiaCpf').value = '';
            document.getElementById('odontologiaSearch').value = '';
            filterAppointments();
        }
        function clearMedicasFilters() {
            document.getElementById('medicasStartDate').value = '';
            document.getElementById('medicasEndDate').value = '';
            document.getElementById('medicasProfessional').value = '';
            document.getElementById('medicasCpf').value = '';
            document.getElementById('medicasSearch').value = '';
            filterAppointments();
        }
        function clearExamesFilters() {
            document.getElementById('examesStartDate').value = '';
            document.getElementById('examesEndDate').value = '';
            document.getElementById('examesProfessional').value = '';
            document.getElementById('examesCpf').value = '';
            document.getElementById('examesSearch').value = '';
            filterAppointments();
        }
        function toggleScheduled() {
            const grid = document.getElementById('scheduledGrid');
            const btn = document.getElementById('toggleScheduledBtn');
            if (grid.style.display === 'none' || grid.style.display === '') {
                grid.style.display = 'grid';
                grid.classList.add('show');
                btn.textContent = 'Ocultar Consultas Agendadas';
                displayAppointments();
            } else {
                grid.style.display = 'none';
                grid.classList.remove('show');
                btn.textContent = 'Mostrar Consultas Agendadas';
            }
        }
        function toggleReport() {
            const content = document.getElementById('reportContent');
            const btn = document.getElementById('toggleReportBtn');
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                btn.textContent = 'Ocultar Relatórios';
            } else {
                content.style.display = 'none';
                btn.textContent = 'Mostrar Relatórios';
            }
        }
        function toggleAgendaMgmt() {
            const section = document.getElementById('agendaMgmtSection');
            const btn = document.querySelector('.agenda-mgmt-toggle');
            if (section.style.display === 'none' || section.style.display === '') {
                section.style.display = 'block';
                btn.textContent = '📋 Fechar Gestão';
                displayAgendaMgmt();
            } else {
                section.style.display = 'none';
                btn.textContent = '📋 Gestão de Agendas';
            }
        }
        const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
        const periodNames = ['1º Período', '2º Período', '3º Período'];
        // Icons for periods
        const periodIcons = ['☀️', '🍽️', '🌅'];
        const periodColors = ['period-morning', 'period-lunch', 'period-afternoon'];
        // Updated displayAgendaMgmt for accordion-based view with day toggles and per-period toggles - Only Monday to Friday, plus per-professional customs
        function displayAgendaMgmt() {
            const grid = document.getElementById('agendaMgmtGrid');
            grid.innerHTML = '';
            agendaTypes.forEach((type, typeIndex) => {
                const item = document.createElement('div');
                item.className = `agenda-mgmt-item ${type === 'Agenda Odontológica' ? 'odontologica' : type === 'Agenda Especialidades Médicas' ? 'medicas' : ''}`;
                item.innerHTML = `
                    <h4>${type} <span style="font-size: 12px; color: #6c757d;">(Clique nos profissionais para expandir)</span></h4>
                `;
                const professionalCustoms = document.createElement('div');
                professionalCustoms.className = 'professional-customs';
                professionalCustoms.innerHTML = '<h5>Configurações Personalizadas por Profissional</h5>';
                const customContainer = document.createElement('div');
                customContainer.id = `customSchedules_${type.replace(/\s+/g, '_')}`;
                const professionals = getProfessionals(type);
                professionals.forEach(prof => {
                    const accordion = document.createElement('div');
                    accordion.className = 'accordion';
                    accordion.innerHTML = `
                        <div class="accordion-header prof-accordion-header">
                            <span class="accordion-title" onclick="toggleAccordion(this.parentElement)"><i class="fas fa-user-md"></i> ${prof}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="accordion-content">
                            ${createProfessionalScheduleTable(type, prof)}
                            <button class="reset-global-btn" onclick="savePersonalizedSchedule('${type}', '${prof}')">Salvar quadro de Horários</button>
                        </div>
                    `;
                    customContainer.appendChild(accordion);
                });
                professionalCustoms.appendChild(customContainer);
                item.appendChild(professionalCustoms);
                // Add save button for the type
                const saveBtn = document.createElement('button');
                saveBtn.className = 'save-agenda-btn';
                saveBtn.textContent = `Salvar Agenda ${type}`;
                saveBtn.onclick = () => {
        localStorage.setItem('agendaSchedules', JSON.stringify(agendaSchedules));
        showToast(`Agenda para ${type} salva com sucesso!`, 'success');
        // NOVA: Sincroniza sempre para este type
        if (currentAgendaType === type) {
            generateCalendar(currentAgendaType);
            if (selectedDay) {
                populateHours(selectedDay);
            }
        }
    };
                item.appendChild(saveBtn);
                grid.appendChild(item);
            });
        }
        function toggleAccordion(header) {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            header.classList.toggle('active');
            content.classList.toggle('active');
            icon.style.transform = header.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        function createProfessionalScheduleTable(type, prof) {
            const schedule = agendaSchedules[type].custom[prof];
            let tableHTML = `
                <h6>Agenda Personalizada para ${prof}</h6>
                <table class="agenda-table">
                    <thead>
                        <tr>
                            <th>Período</th>
                            ${dayNames.map((day, dayIndex) => `
                                <th>
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
                                        ${day}
                                        <input type="checkbox" class="day-toggle" ${schedule[dayIndex + 1].periods.every(p => p.enabled) ? 'checked' : ''} onchange="toggleDayCustom('${type}', '${prof}', ${dayIndex + 1}, this.checked)" aria-label="Ativar/Desativar ${day} para ${prof}">
                                        <span class="enabled-indicator ${schedule[dayIndex + 1].periods.every(p => p.enabled) ? '' : 'disabled-indicator'}"></span>
                                    </div>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
            `;
            for (let p = 0; p < 3; p++) {
                tableHTML += `<tr><td><span class="period-icon ${periodColors[p]}">${periodIcons[p]}</span>${periodNames[p]}</td>`;
                for (let d = 1; d <= 5; d++) {
                    const daySchedule = schedule[d] || { periods: Array(3).fill({enabled: false, start: '', end: ''}) };
                    const period = daySchedule.periods[p] || {enabled: false, start: '', end: ''};
                    const isDisabledPeriod = !period.enabled;
                    const isGray = isDisabledPeriod || (!period.start && !period.end);
                    const indicatorClass = period.enabled ? '' : 'disabled-indicator';
                    tableHTML += `
                        <td class="${isDisabledPeriod ? 'disabled-day' : ''} ${isGray ? 'gray-cell' : ''}">
                            <div class="time-input-group">
                                <input type="checkbox" class="period-toggle" ${period.enabled ? 'checked' : ''} onchange="togglePeriodCustom('${type}', '${prof}', ${d}, ${p}, this.checked)" aria-label="Ativar/Desativar ${periodNames[p]} para ${prof}">
                                <input type="time" value="${period.start || ''}" onchange="updatePeriodStartCustom('${type}', '${prof}', ${d}, ${p}, this.value)" ${isDisabledPeriod ? 'disabled' : ''}>
                                <span>-</span>
                                <input type="time" value="${period.end || ''}" onchange="updatePeriodEndCustom('${type}', '${prof}', ${d}, ${p}, this.value)" ${isDisabledPeriod ? 'disabled' : ''}>
                                <span class="enabled-indicator ${indicatorClass}"></span>
                            </div>
                        </td>
                    `;
                }
                tableHTML += `</tr>`;
            }
            tableHTML += `
                    </tbody>
                    <tr class="duration-row">
                        <td colspan="6" style="text-align: right; padding: 15px;">
                            <label>Tempo de Atendimento: <input type="number" min="5" max="120" value="${schedule.duration || intervals[type]}" onchange="updateDuration('${type}', '${prof}', this.value)" style="width: 80px; margin-left: 10px;"> minutos</label>
                        </td>
                    </tr>
                </table>
            `;
            return tableHTML;
        }
        function updateDuration(type, prof, value) {
            const numValue = parseInt(value);
            if (isNaN(numValue) || numValue < 5 || numValue > 120) {
                showToast('Tempo deve ser entre 5 e 120 minutos.', 'error');
                return;
            }
            agendaSchedules[type].custom[prof].duration = numValue;
            refreshProfessionalAccordion(type, prof);
            showToast(`Tempo de atendimento atualizado para ${prof}: ${numValue} min`, 'success');
            // If current, update hours
            if (currentAgendaType === type && selectedDay && document.getElementById('dentistSelect').value === prof) {
                populateHours(selectedDay);
            }
        }
        function refreshProfessionalAccordion(type, prof) {
            const customContainerId = `customSchedules_${type.replace(/\s+/g, '_')}`;
            const customContainer = document.getElementById(customContainerId);
            if (!customContainer) return;
            const accordion = Array.from(customContainer.children).find(child =>
                child.querySelector('.accordion-title')?.textContent.includes(prof)
            );
            if (!accordion) return;
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            const wasActive = content.classList.contains('active');
            const newContentHTML = createProfessionalScheduleTable(type, prof) +
                '<button class="reset-global-btn" onclick="savePersonalizedSchedule(\'' + type + '\', \'' + prof + '\')">Salvar quadro de Horários</button>';
            content.innerHTML = newContentHTML;
            if (wasActive) {
                content.classList.add('active');
                header.classList.add('active');
                header.querySelector('i').style.transform = 'rotate(180deg)';
            }
            showToast(`Atualização aplicada para ${prof} em ${type}.`, 'success');
        }
        function toggleDayCustom(type, prof, day, enabled) {
            const schedule = agendaSchedules[type].custom[prof];
            schedule[day].periods.forEach(p => {
                p.enabled = enabled;
                if (!enabled) {
                    p.start = '';
                    p.end = '';
                }
            });
            refreshProfessionalAccordion(type, prof);
            showToast(`Dia ${day} ${enabled ? 'ativado' : 'desativado'} para ${prof} em ${type}.`, enabled ? 'success' : 'warning');
        }
        function togglePeriodCustom(type, prof, day, periodIndex, enabled) {
            const schedule = agendaSchedules[type].custom[prof];
            const period = schedule[day].periods[periodIndex];
            period.enabled = enabled;
            if (!enabled) {
                period.start = '';
                period.end = '';
            }
            refreshProfessionalAccordion(type, prof);
            showToast(`${periodIndex + 1}º período ${enabled ? 'ativado' : 'desativado'} para ${prof} em ${type} no dia ${day}.`, enabled ? 'success' : 'warning');
        }
        function updatePeriodStartCustom(type, prof, day, periodIndex, value) {
            agendaSchedules[type].custom[prof][day].periods[periodIndex].start = value;
            refreshProfessionalAccordion(type, prof);
        }
        function updatePeriodEndCustom(type, prof, day, periodIndex, value) {
            agendaSchedules[type].custom[prof][day].periods[periodIndex].end = value;
            refreshProfessionalAccordion(type, prof);
        }
        function savePersonalizedSchedule(type, prof) {
    localStorage.setItem('agendaSchedules', JSON.stringify(agendaSchedules));
    showToast(`Agenda personalizada para ${prof} em ${type} salva com sucesso!`, 'success');
    // NOVA: Sincroniza calendário e horários se relevante
    if (currentAgendaType === type) {
        generateCalendar(currentAgendaType);
        if (selectedDay && (!prof || document.getElementById('dentistSelect').value === prof)) {
            populateHours(selectedDay);
        }
    }
}
        function resetToGlobal(type, prof) {
            if (confirm(`Deseja resetar a agenda de ${prof} para a configuração global?`)) {
                agendaSchedules[type].custom[prof] = JSON.parse(JSON.stringify(agendaSchedules[type].global));
                agendaSchedules[type].custom[prof].duration = professionalDurations[prof] || intervals[type];
                refreshProfessionalAccordion(type, prof);
                showToast(`Agenda de ${prof} resetada para global em ${type}.`, 'success');
            }
        }
        function saveAppointment() {
            const btn = document.getElementById('scheduleBtn');
            const spinner = document.getElementById('scheduleSpinner');
            btn.classList.add('loading');
            spinner.style.display = 'block';
            setTimeout(() => {
                const patientName = sanitizeInput(document.getElementById('patientName').value.trim());
                const patientCpf = document.getElementById('patientCpf').value.trim();
                const cpfClean = patientCpf.replace(/\D/g, '');
                const patientPhone = document.getElementById('patientPhone').value.trim();
                const phoneClean = patientPhone.replace(/\D/g, '');
                const schedulerName = sanitizeInput(document.getElementById('schedulerName').value.trim());
                const observations = sanitizeInput(document.getElementById('observations').value.trim());
                const agendaType = document.getElementById('agendaTypeSelect').value;
                const professional = sanitizeInput(document.getElementById('dentistSelect').value);
                const location = document.getElementById('locationSelect').value;
                const priority = document.getElementById('prioritySelect').value;
                const firstAppointment = document.getElementById('firstAppointmentSelect').value;
                const dateStr = selectedDay.toLocaleDateString('pt-BR');
                const dateYYYY = formatDateToYYYYMMDD(selectedDay);
                const dayOfWeek = selectedDay.getDay();
                if (isHoliday(selectedDay)) {
                    showToast(`Não é possível agendar em feriados: ${getHolidayName(selectedDay)}.`, 'error');
                    btn.classList.remove('loading');
                    spinner.style.display = 'none';
                    return;
                }
                if (isBlocked(dateStr, agendaType)) {
                    const reason = blockedDates.find(b => b.date === dateStr && b.agendaType === agendaType)?.reason;
                    showToast(`Não é possível agendar em data bloqueada para ${agendaType}: ${reason}.`, 'error');
                    btn.classList.remove('loading');
                    spinner.style.display = 'none';
                    return;
                }
                if (isProfessionalBlockedOnDate(professional, agendaType, dateYYYY)) {
                    const reason = blockedProfessionals.find(bp => bp.professional === professional && bp.agendaType === agendaType && dateYYYY >= bp.startDate && dateYYYY <= bp.endDate)?.reason;
                    showToast(`Não é possível agendar com profissional bloqueado para ${agendaType} nesta data: ${reason}.`, 'error');
                    btn.classList.remove('loading');
                    spinner.style.display = 'none';
                    return;
                }
                const slots = generateSlotsForDay(agendaType, dayOfWeek, professional);
                if (slots.length === 0 || !slots.includes(selectedHour)) {
                    showToast(`Horário inválido ou sem disponibilidade para ${agendaType} neste dia da semana.`, 'error');
                    btn.classList.remove('loading');
                    spinner.style.display = 'none';
                    return;
                }
                if (patientCpf && !isValidCPF(cpfClean)) {
                    showToast('CPF inválido.', 'error');
                    btn.classList.remove('loading');
                    spinner.style.display = 'none';
                    return;
                }
                if (phoneClean.length < 10 || phoneClean.length > 11) {
                    showToast('Telefone inválido.', 'error');
                    btn.classList.remove('loading');
                    spinner.style.display = 'none';
                    return;
                }
                const existing = appointments.find(apt =>
                    apt.agendaType === agendaType &&
                    apt.date === dateStr &&
                    apt.time === selectedHour &&
                    apt.professional === professional
                );
                if (existing) {
                    showToast('Já existe um agendamento para este profissional nesta data e horário.', 'error');
                    btn.classList.remove('loading');
                    spinner.style.display = 'none';
                    return;
                }
                const appointment = {
                    id: Date.now(),
                    patient: patientName,
                    cpf: patientCpf,
                    phone: patientPhone,
                    scheduler: schedulerName,
                    observations,
                    location,
                    agendaType,
                    date: dateStr,
                    time: selectedHour,
                    professional,
                    priority,
                    firstAppointment,
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    discount: Object.keys(discountObj).length > 0 ? discountObj : undefined
                };
                appointments.unshift(appointment);
                localStorage.setItem('appointments', JSON.stringify(appointments));
                currentPrintId = appointment.id;
                updateAppointmentDatesSet();
                showToast('Consulta agendada com sucesso! ✅');
                resetToEmpty();
                generateCalendar(currentAgendaType);
                if (document.getElementById('scheduledGrid').style.display !== 'none') {
                    displayAppointments();
                }
                btn.classList.remove('loading');
                spinner.style.display = 'none';
                justScheduled = true;
                document.getElementById('printConfirmModal').style.display = 'block';
                focusTrap(document.getElementById('printConfirmModal'));
            }, 1000);
        }
        function editAppointment(id) {
            const appointment = appointments.find(apt => apt.id === id);
            if (appointment) {
                editingId = id;
                document.getElementById('editPatientName').value = appointment.patient;
                document.getElementById('editPatientCpf').value = appointment.cpf || '';
                document.getElementById('editPatientPhone').value = appointment.phone || '';
                document.getElementById('editSchedulerName').value = appointment.scheduler || '';
                document.getElementById('editObservations').value = appointment.observations || '';
                document.getElementById('editLocationSelect').value = appointment.location || '';
                const agendaType = appointment.agendaType || '';
                document.getElementById('editAgendaTypeSelect').value = agendaType;
                populateEditProfessionals();
                const professional = appointment.professional || '';
                document.getElementById('editDentistSelect').value = professional;
                populateEditTimes();
                document.getElementById('editPrioritySelect').value = appointment.priority || '';
                document.getElementById('editFirstAppointmentSelect').value = appointment.firstAppointment || '';
                const [d, m, y] = appointment.date.split('/');
                document.getElementById('editDate').value = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                document.getElementById('editTime').value = appointment.time;
                document.getElementById('editModal').style.display = 'block';
                document.getElementById('editPatientName').focus();
                focusTrap(document.getElementById('editModal'));
            }
        }
        function saveEdit() {
            const patientName = sanitizeInput(document.getElementById('editPatientName').value.trim());
            const patientCpf = document.getElementById('editPatientCpf').value.trim();
            const cpfClean = patientCpf.replace(/\D/g, '');
            const patientPhone = document.getElementById('editPatientPhone').value.trim();
            const phoneClean = patientPhone.replace(/\D/g, '');
            const schedulerName = sanitizeInput(document.getElementById('editSchedulerName').value.trim());
            const observations = sanitizeInput(document.getElementById('editObservations').value.trim());
            const location = document.getElementById('editLocationSelect').value;
            const agendaType = document.getElementById('editAgendaTypeSelect').value;
            const professional = sanitizeInput(document.getElementById('editDentistSelect').value);
            const priority = document.getElementById('editPrioritySelect').value;
            const firstAppointment = document.getElementById('editFirstAppointmentSelect').value;
            const newDateInput = document.getElementById('editDate').value;
            const newTime = document.getElementById('editTime').value;
            if (!patientName || (patientCpf && !isValidCPF(cpfClean)) || (phoneClean.length < 10 || phoneClean.length > 11) || !location || !agendaType || !professional || !newDateInput || !newTime || !priority || !firstAppointment) {
                showToast('Preencha todos os campos obrigatórios e verifique o CPF e telefone.', 'error');
                return;
            }
            const [y, m, d] = newDateInput.split('-');
            const newDateStr = `${d}/${m}/${y}`;
            const newDateObj = new Date(y, m - 1, d);
            const newDateYYYY = formatDateToYYYYMMDD(newDateObj);
            const newDayOfWeek = newDateObj.getDay();
            if (isHoliday(newDateObj)) {
                showToast(`Não é possível agendar em feriados: ${getHolidayName(newDateObj)}.`, 'error');
                return;
            }
            if (isBlocked(newDateStr, agendaType)) {
                const reason = blockedDates.find(b => b.date === newDateStr && b.agendaType === agendaType)?.reason;
                showToast(`Não é possível agendar em data bloqueada para ${agendaType}: ${reason}.`, 'error');
                return;
            }
            if (isProfessionalBlockedOnDate(professional, agendaType, newDateYYYY)) {
                const reason = blockedProfessionals.find(bp => bp.professional === professional && bp.agendaType === agendaType && newDateYYYY >= bp.startDate && newDateYYYY <= bp.endDate)?.reason;
                showToast(`Não é possível agendar com profissional bloqueado para ${agendaType} nesta data: ${reason}.`, 'error');
                return;
            }
            const slots = generateSlotsForDay(agendaType, newDayOfWeek, professional);
            if (slots.length === 0 || !slots.includes(newTime)) {
                showToast(`Horário inválido ou sem disponibilidade para ${agendaType} neste dia da semana.`, 'error');
                return;
            }
            const existing = appointments.find(apt =>
                apt.id !== editingId &&
                apt.agendaType === agendaType &&
                apt.date === newDateStr &&
                apt.time === newTime &&
                apt.professional === professional
            );
            if (existing) {
                showToast('Conflito: Já existe um agendamento neste horário para este profissional.', 'error');
                return;
            }
            const appointment = appointments.find(apt => apt.id === editingId);
            if (appointment) {
                const oldDateStr = appointment.date;
                appointment.patient = patientName;
                appointment.cpf = patientCpf;
                appointment.phone = patientPhone;
                appointment.scheduler = schedulerName;
                appointment.observations = observations;
                appointment.location = location;
                appointment.agendaType = agendaType;
                appointment.date = newDateStr;
                appointment.time = newTime;
                appointment.professional = professional;
                appointment.priority = priority;
                appointment.firstAppointment = firstAppointment;
                appointment.timestamp = new Date().toISOString();
                if (oldDateStr !== newDateStr) {
                    updateAppointmentDatesSet();
                }
            }
            localStorage.setItem('appointments', JSON.stringify(appointments));
            closeModal('editModal');
            editingId = null;
            showToast('Consulta atualizada com sucesso! ✅');
            generateCalendar(currentAgendaType);
            if (document.getElementById('scheduledGrid').style.display !== 'none') {
                displayAppointments();
            }
        }
// Updated function to handle inactivation with confirmation and reason
function handleInactivateOrReactivate(id) {
    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) return;
    const isInactive = appointment.status === 'inactive';
    const actionText = isInactive ? 'reativar' : 'inativar';
    const confirmText = `Deseja realmente ${actionText} este agendamento?`;
    const titleText = `Confirmar ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`;
    currentActionId = id;
    currentActionType = isInactive ? 'reactivate' : 'inactivate';
    document.getElementById('deleteTitle').textContent = titleText;
    document.getElementById('confirmDescription').textContent = confirmText;
    document.getElementById('deleteModal').style.display = 'block';
    focusTrap(document.getElementById('deleteModal'));
}
function proceedToReason() {
    closeModal('deleteModal');
    const action = currentActionType;
    const title = `Motivo da ${action === 'reactivate' ? 'Reativação' : 'Inativação'}`;
    const desc = `Informe o motivo da ${action === 'reactivate' ? 'reativação' : 'inativação'}:`;
    const reasonModal = document.getElementById('reasonModal');
    if (!reasonModal) {
        console.error('Modal de motivo não encontrado. Certifique-se de que #reasonModal existe no HTML.');
        showToast('Erro: Modal de motivo não encontrado. Verifique o HTML.', 'error');
        return;
    }
    document.getElementById('reasonTitle').textContent = title;
    document.getElementById('reasonDescription').textContent = desc;
    document.getElementById('reasonInput').value = '';
    reasonModal.style.display = 'block';
    document.getElementById('reasonInput').focus();
    focusTrap(reasonModal);
}
function confirmReason() {
    const reason = document.getElementById('reasonInput').value.trim();
    if (!reason) {
        showToast('Motivo é obrigatório.', 'error');
        return;
    }
    const apt = appointments.find(a => a.id === currentActionId);
    if (!apt) {
        showToast('Agendamento não encontrado.', 'error');
        return;
    }
    const action = currentActionType;
    if (action === 'inactivate') {
        apt.status = 'inactive';
        apt.inactiveReason = sanitizeInput(reason);
    } else {
        apt.status = 'pending';
        apt.reactivationReason = sanitizeInput(reason);
    }
    apt.timestamp = new Date().toISOString();
    localStorage.setItem('appointments', JSON.stringify(appointments));
    updateAppointmentDatesSet();
    closeModal('reasonModal');
    const actionVerb = action === 'inactivate' ? 'inativado' : 'reativado';
    showToast(`Agendamento ${actionVerb} com sucesso! ✅`, 'success');
    generateCalendar(currentAgendaType);
    if (document.getElementById('scheduledGrid').style.display !== 'none') {
        displayAppointments();
    }
    currentActionId = null;
    currentActionType = '';
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    if (modalId === 'printConfirmModal' && justScheduled) {
        setTimeout(() => {
            justScheduled = false;
            window.location.reload();
        }, 1000);
    }
    const triggeringButton = document.activeElement;
    if (triggeringButton && (triggeringButton.classList.contains('btn-edit') || triggeringButton.classList.contains('btn-delete'))) {
        triggeringButton.focus();
    }
}
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const blockModal = document.getElementById('blockModal');
    const blockProfessionalModal = document.getElementById('blockProfessionalModal');
    const printConfirmModal = document.getElementById('printConfirmModal');
    const printTypeModal = document.getElementById('printTypeModal');
    const patientHistoryModal = document.getElementById('patientHistoryModal');
    const discountModal = document.getElementById('discountModal');
    const declarationTimeModal = document.getElementById('declarationTimeModal');
    const reasonModal = document.getElementById('reasonModal');
    if (event.target === editModal) closeModal('editModal');
    if (event.target === blockModal) closeModal('blockModal');
    if (event.target === blockProfessionalModal) closeModal('blockProfessionalModal');
    if (event.target === printConfirmModal) closeModal('printConfirmModal');
    if (event.target === printTypeModal) closeModal('printTypeModal');
    if (event.target === patientHistoryModal) closeModal('patientHistoryModal');
    if (event.target === discountModal) closeModal('discountModal');
    if (event.target === declarationTimeModal) closeModal('declarationTimeModal');
    if (event.target === reasonModal) closeModal('reasonModal');
    window.onclick = function(event) {
    // ... ifs existentes ...
    if (event.target === declarationTimeModal) closeModal('declarationTimeModal');
    const reasonModal = document.getElementById('reasonModal');
    if (event.target === reasonModal) closeModal('reasonModal'); // Novo: Fecha ao clicar fora
}
}
function filterAppointments() {
    displayAppointments();
}
// Updated displayAppointments to handle inactive status visually
function displayAppointments() {
    const odontologiaList = document.getElementById('odontologiaList');
    const medicasList = document.getElementById('medicasList');
    const examesList = document.getElementById('examesList');
    const odontologiaStart = document.getElementById('odontologiaStartDate').value;
    const odontologiaEnd = document.getElementById('odontologiaEndDate').value;
    const odontologiaProf = document.getElementById('odontologiaProfessional').value;
    const odontologiaCpf = document.getElementById('odontologiaCpf').value.replace(/\D/g, '');
    const odontologiaSearch = document.getElementById('odontologiaSearch').value.toLowerCase().trim();
    const medicasStart = document.getElementById('medicasStartDate').value;
    const medicasEnd = document.getElementById('medicasEndDate').value;
    const medicasProf = document.getElementById('medicasProfessional').value;
    const medicasCpf = document.getElementById('medicasCpf').value.replace(/\D/g, '');
    const medicasSearch = document.getElementById('medicasSearch').value.toLowerCase().trim();
    const examesStart = document.getElementById('examesStartDate').value;
    const examesEnd = document.getElementById('examesEndDate').value;
    const examesProf = document.getElementById('examesProfessional').value;
    const examesCpf = document.getElementById('examesCpf').value.replace(/\D/g, '');
    const examesSearch = document.getElementById('examesSearch').value.toLowerCase().trim();
    let odontologiaAppts = appointments.filter(apt => apt.agendaType === 'Agenda Odontológica');
    odontologiaAppts = odontologiaAppts.filter(apt => {
        const aptDate = new Date(apt.date.split('/').reverse().join('-'));
        if (odontologiaStart) {
            const start = new Date(odontologiaStart);
            if (aptDate < start) return false;
        }
        if (odontologiaEnd) {
            const end = new Date(odontologiaEnd);
            if (aptDate > end) return false;
        }
        if (odontologiaProf && apt.professional !== odontologiaProf) return false;
        if (odontologiaCpf && apt.cpf.replace(/\D/g, '') !== odontologiaCpf) return false;
        if (odontologiaSearch && !apt.patient.toLowerCase().includes(odontologiaSearch)) return false;
        return true;
    });
    let medicasAppts = appointments.filter(apt => apt.agendaType === 'Agenda Especialidades Médicas');
    medicasAppts = medicasAppts.filter(apt => {
        const aptDate = new Date(apt.date.split('/').reverse().join('-'));
        if (medicasStart) {
            const start = new Date(medicasStart);
            if (aptDate < start) return false;
        }
        if (medicasEnd) {
            const end = new Date(medicasEnd);
            if (aptDate > end) return false;
        }
        if (medicasProf && apt.professional !== medicasProf) return false;
        if (medicasCpf && apt.cpf.replace(/\D/g, '') !== medicasCpf) return false;
        if (medicasSearch && !apt.patient.toLowerCase().includes(medicasSearch)) return false;
        return true;
    });
    let examesAppts = appointments.filter(apt => apt.agendaType === 'Agenda de Exames');
    examesAppts = examesAppts.filter(apt => {
        const aptDate = new Date(apt.date.split('/').reverse().join('-'));
        if (examesStart) {
            const start = new Date(examesStart);
            if (aptDate < start) return false;
        }
        if (examesEnd) {
            const end = new Date(examesEnd);
            if (aptDate > end) return false;
        }
        if (examesProf && apt.professional !== examesProf) return false;
        if (examesCpf && apt.cpf.replace(/\D/g, '') !== examesCpf) return false;
        if (examesSearch && !apt.patient.toLowerCase().includes(examesSearch)) return false;
        return true;
    });
    if (odontologiaAppts.length === 0) {
        odontologiaList.innerHTML = '<p class="empty-message">Nenhum agendamento odontológico.</p>';
    } else {
        odontologiaList.innerHTML = '';
        odontologiaAppts.forEach((apt, index) => {
            const statusClass = getStatusClass(apt.status);
            const statusText = getStatusText(apt.status);
            const schedulerText = apt.scheduler ? ` | Responsável: ${sanitizeInput(apt.scheduler)}` : '';
            const isInactive = apt.status === 'inactive';
            const inactiveIcon = isInactive ? '🚫 ' : '';
            const inactiveTooltip = isInactive ? ` title="Motivo: ${apt.inactiveReason || 'Não informado'}"` : '';
            const reactivationTooltip = apt.reactivationReason ? ` title="Reativado: ${apt.reactivationReason}"` : '';
            const reactivationClass = apt.reactivationReason ? 'reactivated' : '';
            const statusDisplay = `${statusText}${apt.reactivationReason ? ' (Reativado)' : ''}`;
            const card = document.createElement('div');
            card.className = `appointment-card ${isInactive ? 'inactive-card' : ''}`;
            card.style.animationDelay = `${index * 0.1}s`;
            card.setAttribute('role', 'listitem');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Agendamento de ${apt.patient} em ${apt.date} às ${apt.time} - Status: ${statusDisplay}${isInactive ? ` (Inativo: ${apt.inactiveReason || 'Motivo não informado'})` : apt.reactivationReason ? ` (Reativado: ${apt.reactivationReason})` : ''}`);
            card.innerHTML = `
                <div class="appointment-actions">
                    <button class="btn-edit" onclick="editAppointment(${apt.id})" aria-label="Editar este agendamento" role="button">Editar</button>
                    <button class="btn-declaration" onclick="generateAttendanceDeclarationForAppointment(${apt.id})" aria-label="Gerar Declaração de Comparecimento" role="button">Declaração</button>
                    <button class="btn-delete ${isInactive ? 'inactive-btn' : ''}" onclick="handleInactivateOrReactivate(${apt.id})" aria-label="${isInactive ? 'Reativar' : 'Inativar'} este agendamento${isInactive ? ' (já inativo)' : ''}" role="button"${inactiveTooltip || reactivationTooltip}>${isInactive ? 'Reativar' : 'Inativar'}</button>
                    <button class="btn-pdf" onclick="preparePrint(${apt.id})" aria-label="Imprimir comprovante" role="button">Imprimir</button>
                </div>
                <h4><span class="patient-name" onclick="showPatientHistory('${apt.cpf}', '${apt.patient}')" aria-label="Ver histórico de ${apt.patient}">${sanitizeInput(apt.patient)}</span> - ${apt.time} | ${apt.date} ${inactiveIcon}</h4>
                <p>CPF: ${apt.cpf || 'Não informado'} | Telefone: ${apt.phone || 'Não informado'} | Profissional: ${sanitizeInput(apt.professional)} | Tipo: ${apt.agendaType || 'Não informado'} | Local: ${apt.location || 'Não informado'} | Prioritário: ${apt.priority || 'Não informado'} | Primeiro Atendimento: ${apt.firstAppointment || 'Não informado'}${schedulerText}</p>
                ${apt.observations ? `<p class="observations">Observações: ${sanitizeInput(apt.observations)}</p>` : ''}
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="status ${statusClass} ${reactivationClass}"${inactiveTooltip}${reactivationTooltip}>Status: ${statusDisplay}</span>
                        ${!isInactive ? `
                        <button class="btn-attended" onclick="updateAttendanceStatus(${apt.id}, 'attended')" aria-label="Marcar como compareceu" role="button">Compareceu</button>
                        <button class="btn-no-show" onclick="updateAttendanceStatus(${apt.id}, 'no-show')" aria-label="Marcar como não compareceu" role="button">Não Compareceu</button>
                        <button class="btn-rescheduled" onclick="updateAttendanceStatus(${apt.id}, 'rescheduled')" aria-label="Marcar como reagendado" role="button">Reagendado</button>
                        ` : ''}
                    </div>
                    <button class="btn-clinica" onclick="confirmOpenFicha('${apt.cpf || ''}', '${apt.patient}', '${apt.phone || ''}', '${apt.observations || ''}')" aria-label="Abrir Ficha Odontológica" role="button">Ficha Odontológica</button>
                </div>
            `;
            setTimeout(() => card.classList.add('show'), index * 50);
            odontologiaList.appendChild(card);
        });
    }
    if (medicasAppts.length === 0) {
        medicasList.innerHTML = '<p class="empty-message">Nenhum agendamento de especialidades médicas.</p>';
    } else {
        medicasList.innerHTML = '';
        medicasAppts.forEach((apt, index) => {
            const statusClass = getStatusClass(apt.status);
            const statusText = getStatusText(apt.status);
            const schedulerText = apt.scheduler ? ` | Responsável: ${sanitizeInput(apt.scheduler)}` : '';
            const isInactive = apt.status === 'inactive';
            const inactiveIcon = isInactive ? '🚫 ' : '';
            const inactiveTooltip = isInactive ? ` title="Motivo: ${apt.inactiveReason || 'Não informado'}"` : '';
            const reactivationTooltip = apt.reactivationReason ? ` title="Reativado: ${apt.reactivationReason}"` : '';
            const reactivationClass = apt.reactivationReason ? 'reactivated' : '';
            const statusDisplay = `${statusText}${apt.reactivationReason ? ' (Reativado)' : ''}`;
            const card = document.createElement('div');
            card.className = `appointment-card ${isInactive ? 'inactive-card' : ''}`;
            card.style.animationDelay = `${index * 0.1}s`;
            card.setAttribute('role', 'listitem');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Agendamento de ${apt.patient} em ${apt.date} às ${apt.time} - Status: ${statusDisplay}${isInactive ? ` (Inativo: ${apt.inactiveReason || 'Motivo não informado'})` : apt.reactivationReason ? ` (Reativado: ${apt.reactivationReason})` : ''}`);
            card.innerHTML = `
                <div class="appointment-actions">
                    <button class="btn-edit" onclick="editAppointment(${apt.id})" aria-label="Editar este agendamento" role="button">Editar</button>
                    <button class="btn-declaration" onclick="generateAttendanceDeclarationForAppointment(${apt.id})" aria-label="Gerar Declaração de Comparecimento" role="button">Declaração</button>
                    <button class="btn-delete ${isInactive ? 'inactive-btn' : ''}" onclick="handleInactivateOrReactivate(${apt.id})" aria-label="${isInactive ? 'Reativar' : 'Inativar'} este agendamento${isInactive ? ' (já inativo)' : ''}" role="button"${inactiveTooltip || reactivationTooltip}>${isInactive ? 'Reativar' : 'Inativar'}</button>
                    <button class="btn-pdf" onclick="preparePrint(${apt.id})" aria-label="Imprimir comprovante" role="button">Imprimir</button>
                </div>
                <h4><span class="patient-name" onclick="showPatientHistory('${apt.cpf}', '${apt.patient}')" aria-label="Ver histórico de ${apt.patient}">${sanitizeInput(apt.patient)}</span> - ${apt.time} | ${apt.date} ${inactiveIcon}</h4>
                <p>CPF: ${apt.cpf || 'Não informado'} | Telefone: ${apt.phone || 'Não informado'} | Profissional: ${sanitizeInput(apt.professional)} | Tipo: ${apt.agendaType || 'Não informado'} | Local: ${apt.location || 'Não informado'} | Prioritário: ${apt.priority || 'Não informado'} | Primeiro Atendimento: ${apt.firstAppointment || 'Não informado'}${schedulerText}</p>
                ${apt.observations ? `<p class="observations">Observações: ${sanitizeInput(apt.observations)}</p>` : ''}
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="status ${statusClass} ${reactivationClass}"${inactiveTooltip}${reactivationTooltip}>Status: ${statusDisplay}</span>
                        ${!isInactive ? `
                        <button class="btn-attended" onclick="updateAttendanceStatus(${apt.id}, 'attended')" aria-label="Marcar como compareceu" role="button">Compareceu</button>
                        <button class="btn-no-show" onclick="updateAttendanceStatus(${apt.id}, 'no-show')" aria-label="Marcar como não compareceu" role="button">Não Compareceu</button>
                        <button class="btn-rescheduled" onclick="updateAttendanceStatus(${apt.id}, 'rescheduled')" aria-label="Marcar como reagendado" role="button">Reagendado</button>
                        ` : ''}
                    </div>
                    <button class="btn-clinica" onclick="confirmOpenFicha('${apt.cpf || ''}', '${apt.patient}', '${apt.phone || ''}', '${apt.observations || ''}')" aria-label="Abrir Ficha Clínica" role="button">Ficha Clínica</button>
                </div>
            `;
            setTimeout(() => card.classList.add('show'), index * 50);
            medicasList.appendChild(card);
        });
    }
    if (examesAppts.length === 0) {
        examesList.innerHTML = '<p class="empty-message">Nenhum agendamento de exames.</p>';
    } else {
        examesList.innerHTML = '';
        examesAppts.forEach((apt, index) => {
            const statusClass = getStatusClass(apt.status);
            const statusText = getStatusText(apt.status);
            const schedulerText = apt.scheduler ? ` | Responsável: ${sanitizeInput(apt.scheduler)}` : '';
            const isInactive = apt.status === 'inactive';
            const inactiveIcon = isInactive ? '🚫 ' : '';
            const inactiveTooltip = isInactive ? ` title="Motivo: ${apt.inactiveReason || 'Não informado'}"` : '';
            const reactivationTooltip = apt.reactivationReason ? ` title="Reativado: ${apt.reactivationReason}"` : '';
            const reactivationClass = apt.reactivationReason ? 'reactivated' : '';
            const statusDisplay = `${statusText}${apt.reactivationReason ? ' (Reativado)' : ''}`;
            const card = document.createElement('div');
            card.className = `appointment-card ${isInactive ? 'inactive-card' : ''}`;
            card.style.animationDelay = `${index * 0.1}s`;
            card.setAttribute('role', 'listitem');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Agendamento de ${apt.patient} em ${apt.date} às ${apt.time} - Status: ${statusDisplay}${isInactive ? ` (Inativo: ${apt.inactiveReason || 'Motivo não informado'})` : apt.reactivationReason ? ` (Reativado: ${apt.reactivationReason})` : ''}`);
            card.innerHTML = `
                <div class="appointment-actions">
                    <button class="btn-edit" onclick="editAppointment(${apt.id})" aria-label="Editar este agendamento" role="button">Editar</button>
                    <button class="btn-declaration" onclick="generateAttendanceDeclarationForAppointment(${apt.id})" aria-label="Gerar Declaração de Comparecimento" role="button">Declaração</button>
                    <button class="btn-delete ${isInactive ? 'inactive-btn' : ''}" onclick="handleInactivateOrReactivate(${apt.id})" aria-label="${isInactive ? 'Reativar' : 'Inativar'} este agendamento${isInactive ? ' (já inativo)' : ''}" role="button"${inactiveTooltip || reactivationTooltip}>${isInactive ? 'Reativar' : 'Inativar'}</button>
                    <button class="btn-pdf" onclick="preparePrint(${apt.id})" aria-label="Imprimir comprovante" role="button">Imprimir</button>
                </div>
                <h4><span class="patient-name" onclick="showPatientHistory('${apt.cpf}', '${apt.patient}')" aria-label="Ver histórico de ${apt.patient}">${sanitizeInput(apt.patient)}</span> - ${apt.time} | ${apt.date} ${inactiveIcon}</h4>
                <p>CPF: ${apt.cpf || 'Não informado'} | Telefone: ${apt.phone || 'Não informado'} | Profissional: ${sanitizeInput(apt.professional)} | Tipo: ${apt.agendaType || 'Não informado'} | Local: ${apt.location || 'Não informado'} | Prioritário: ${apt.priority || 'Não informado'} | Primeiro Atendimento: ${apt.firstAppointment || 'Não informado'}${schedulerText}</p>
                ${apt.observations ? `<p class="observations">Observações: ${sanitizeInput(apt.observations)}</p>` : ''}
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="status ${statusClass} ${reactivationClass}"${inactiveTooltip}${reactivationTooltip}>Status: ${statusDisplay}</span>
                        ${!isInactive ? `
                        <button class="btn-attended" onclick="updateAttendanceStatus(${apt.id}, 'attended')" aria-label="Marcar como compareceu" role="button">Compareceu</button>
                        <button class="btn-no-show" onclick="updateAttendanceStatus(${apt.id}, 'no-show')" aria-label="Marcar como não compareceu" role="button">Não Compareceu</button>
                        <button class="btn-rescheduled" onclick="updateAttendanceStatus(${apt.id}, 'rescheduled')" aria-label="Marcar como reagendado" role="button">Reagendado</button>
                        ` : ''}
                    </div>
                    <button class="btn-clinica" onclick="confirmOpenFicha('${apt.cpf || ''}', '${apt.patient}', '${apt.phone || ''}', '${apt.observations || ''}')" aria-label="Abrir Ficha Clínica" role="button">Ficha Clínica</button>
                </div>
            `;
            setTimeout(() => card.classList.add('show'), index * 50);
            examesList.appendChild(card);
        });
    }
}
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? '✅' : '❌';
    toast.textContent = `${icon} ${message}`;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.className = 'toast', 3000);
}
function updateAttendanceStatus(id, status) {
    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
        appointment.status = status;
        appointment.timestamp = new Date().toISOString();
        localStorage.setItem('appointments', JSON.stringify(appointments));
        const statusText = getStatusText(status);
        showToast(`Status atualizado: ${statusText}`, 'success');
        if (document.getElementById('scheduledGrid').style.display !== 'none') {
            displayAppointments();
        }
    }
}
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => closeModal(modal.id));
    }
}
function focusTrap(modal) {
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    if (focusableElements.length === 0) return;
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
    firstFocusable.focus();
}
// Discount Modal Functions
function openDiscountModal() {
    const agendaType = document.getElementById('agendaTypeSelect').value;
    const professional = document.getElementById('dentistSelect').value;
    if (!agendaType || !professional) {
        showToast('Selecione o tipo de agenda e o profissional para adicionar desconto.', 'error');
        return;
    }
    currentServicePrice = prices[professional] || 0;
    document.getElementById('serviceNameDisplay').textContent = `${professional} (${agendaType})`;
    document.getElementById('currentPriceDisplay').textContent = `R$ ${currentServicePrice.toFixed(2)}`;
    document.getElementById('serviceInfo').style.display = 'block';
    calculateDiscount();
    document.getElementById('discountModal').style.display = 'block';
    focusTrap(document.getElementById('discountModal'));
    document.getElementById('industryDiscount').checked = false;
    document.getElementById('promotionalDiscount').checked = false;
    document.getElementById('industryDiscountInput').style.display = 'none';
    document.getElementById('promotionalDiscountInput').style.display = 'none';
    document.getElementById('promotionType').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('otherPromotion').style.display = 'none';
    document.getElementById('otherPromotion').value = '';
    document.getElementById('discountedInfo').style.display = 'none';
}
function toggleDiscountInput(inputGroupId, isChecked) {
    const inputGroup = document.getElementById(inputGroupId);
    inputGroup.style.display = isChecked ? 'flex' : 'none';
    calculateDiscount();
}
function calculateDiscount() {
    const industryChecked = document.getElementById('industryDiscount').checked;
    const promotionalChecked = document.getElementById('promotionalDiscount').checked;
    let totalDiscount = 0;
    if (industryChecked) {
        totalDiscount += parseFloat(document.getElementById('industryDiscountValue').value) || 0;
    }
    if (promotionalChecked) {
        totalDiscount += parseFloat(document.getElementById('promotionalDiscountValue').value) || 0;
    }
    const discountedPrice = currentServicePrice * (1 - totalDiscount / 100);
    if (totalDiscount > 0) {
        document.getElementById('discountedPriceDisplay').textContent = `R$ ${discountedPrice.toFixed(2)}`;
        document.getElementById('discountedInfo').style.display = 'block';
    } else {
        document.getElementById('discountedInfo').style.display = 'none';
    }
}
function applyDiscount() {
    const industryChecked = document.getElementById('industryDiscount').checked;
    const promotionalChecked = document.getElementById('promotionalDiscount').checked;
    if (!industryChecked && !promotionalChecked) {
        showToast('Selecione pelo menos um tipo de desconto.', 'error');
        return;
    }
    discountObj = {};
    let discountInfo = '';
    if (industryChecked) {
        const value = parseFloat(document.getElementById('industryDiscountValue').value);
        if (!value || value <= 0) {
            showToast('Informe um valor válido para Desconto Industria.', 'error');
            return;
        }
        discountObj.industry = value;
        discountInfo += `Indústria: ${value}% `;
        document.getElementById('industryDiscountDisplay').textContent = `Desconto Indústria: ${value}%`;
    } else {
        document.getElementById('industryDiscountDisplay').textContent = '';
    }
    if (promotionalChecked) {
        const value = parseFloat(document.getElementById('promotionalDiscountValue').value);
        if (!value || value <= 0) {
            showToast('Informe um valor válido para Desconto Promocional.', 'error');
            return;
        }
        discountObj.promotional = value;
        discountInfo += `Promocional: ${value}% `;
        document.getElementById('promotionalDiscountDisplay').textContent = `Desconto Promocional: ${value}%`;
        const promotionType = document.getElementById('promotionType').value;
        if (promotionType) {
            let promotionName = promotionType;
            if (promotionType === 'Outros') {
                promotionName = document.getElementById('otherPromotion').value.trim();
                if (!promotionName) {
                    showToast('Informe o nome da promoção para "Outros".', 'error');
                    return;
                }
            }
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            if (!startDate || !endDate) {
                showToast('Preencha as datas de início e término da promoção.', 'error');
                return;
            }
            if (!discountObj.promotion) discountObj.promotion = {};
            discountObj.promotion.name = promotionName;
            discountObj.promotion.start = startDate;
            discountObj.promotion.end = endDate;
        }
    } else {
        document.getElementById('promotionalDiscountDisplay').textContent = '';
    }
    document.getElementById('displayedDiscounts').style.display = 'block';
    showToast(`Desconto aplicado: ${discountInfo}`, 'success');
    closeModal('discountModal');
}
function closeDiscountDisplay() {
    document.getElementById('displayedDiscounts').style.display = 'none';
    discountObj = {};
}
window.onload = async function() {
    console.warn('Aviso: Dados salvos em localStorage. Para produção, migre para Firebase ou Supabase para melhor segurança e persistência.');
    try {
        logoBase64 = await getImageBase64('img/sesibranco.png');
        if (!logoBase64) {
            console.warn('Logo não carregado. Verifique o caminho do arquivo "img/sesibranco.png".');
        }
    } catch (e) {
        console.error('Falha ao carregar logo para impressões:', e);
        logoBase64 = '';
    }
    try {
        coloredLogoBase64 = await getImageBase64('img/sesisaude.png');
        if (!coloredLogoBase64) {
            console.warn('Logo colorido não carregado. Verifique o caminho do arquivo "img/sesisaude.png".');
        }
    } catch (e) {
        console.error('Falha ao carregar logo colorido para declarações:', e);
        coloredLogoBase64 = '';
    }
    initializeCustomSchedules();
    localStorage.setItem('agendaSchedules', JSON.stringify(agendaSchedules));
    updateAppointmentDatesSet();
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const toggleBtn = document.querySelector('.theme-toggle');
    toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-checked', savedTheme === 'dark' ? 'true' : 'false');
    const agendaTypeSelect = document.getElementById('agendaTypeSelect');
    agendaTypeSelect.innerHTML = '<option value="">Selecione</option>';
    agendaTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        agendaTypeSelect.appendChild(option);
    });
    const editAgendaTypeSelect = document.getElementById('editAgendaTypeSelect');
    editAgendaTypeSelect.innerHTML = '<option value="">Selecione</option>';
    agendaTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        editAgendaTypeSelect.appendChild(option);
    });
    const reportAgendaTypeSelect = document.getElementById('reportAgendaType');
    reportAgendaTypeSelect.innerHTML = '<option value="">Todos os Tipos</option>';
    agendaTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        reportAgendaTypeSelect.appendChild(option);
    });
    const locationSelect = document.getElementById('locationSelect');
    locationSelect.innerHTML = '<option value="">Selecione um local</option>';
    locations.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc;
        option.textContent = loc;
        locationSelect.appendChild(option);
    });
    const editLocationSelect = document.getElementById('editLocationSelect');
    editLocationSelect.innerHTML = '<option value="">Selecione um local</option>';
    locations.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc;
        option.textContent = loc;
        editLocationSelect.appendChild(option);
    });
    const odontologiaProfessional = document.getElementById('odontologiaProfessional');
    odontologiaProfessional.innerHTML = '<option value="">Todos</option>';
    dentists.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof;
        option.textContent = prof;
        odontologiaProfessional.appendChild(option);
    });
    const medicasProfessional = document.getElementById('medicasProfessional');
    medicasProfessional.innerHTML = '<option value="">Todos</option>';
    medicalSpecialists.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof;
        option.textContent = prof;
        medicasProfessional.appendChild(option);
    });
    const examesProfessional = document.getElementById('examesProfessional');
    examesProfessional.innerHTML = '<option value="">Todos</option>';
    examSpecialists.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof;
        option.textContent = prof;
        examesProfessional.appendChild(option);
    });
    document.getElementById('agendaTypeSelect').onchange = function() {
        currentAgendaType = this.value;
        const location = document.getElementById('locationSelect').value;
        populateProfessionals(this.value, 'dentistSelect', location);
        document.getElementById('dentistSelect').value = '';
        generateCalendar(currentAgendaType);
        if (selectedDay) {
            populateHours(selectedDay);
        }
        updateScheduleButton();
    };
    document.getElementById('locationSelect').onchange = function() {
        const agendaType = document.getElementById('agendaTypeSelect').value;
        if (agendaType) {
            populateProfessionals(agendaType, 'dentistSelect', this.value);
            document.getElementById('dentistSelect').value = '';
        }
        updateScheduleButton();
    };
    document.getElementById('dentistSelect').onchange = function() {
        generateCalendar(currentAgendaType);
        if (selectedDay) {
            populateHours(selectedDay);
        }
        updateScheduleButton();
    };
    document.getElementById('prioritySelect').onchange = function() {
        updateScheduleButton();
    };
    document.getElementById('firstAppointmentSelect').onchange = function() {
        updateScheduleButton();
    };
    document.getElementById('patientName').oninput = updateScheduleButton;
    document.getElementById('patientCpf').oninput = function() { formatCPF(this); validateCPF(this); };
    document.getElementById('patientPhone').oninput = function() { formatPhone(this); validatePhone(this); };
    document.getElementById('schedulerName').oninput = updateScheduleButton;
    const editCpfInput = document.getElementById('editPatientCpf');
    editCpfInput.oninput = function() { formatCPF(this); validateEditCPF(this); };
    const editPhoneInput = document.getElementById('editPatientPhone');
    editPhoneInput.oninput = function() { formatPhone(this); validateEditPhone(this); };
    document.getElementById('editLocationSelect').onchange = function() {
        const agendaType = document.getElementById('editAgendaTypeSelect').value;
        if (agendaType) {
            populateProfessionals(agendaType, 'editDentistSelect', this.value);
            document.getElementById('editDentistSelect').value = '';
        }
    };
    document.getElementById('editAgendaTypeSelect').onchange = function() {
        const location = document.getElementById('editLocationSelect').value;
        populateProfessionals(this.value, 'editDentistSelect', location);
        document.getElementById('editDentistSelect').value = '';
        populateEditTimes();
    };
    currentAgendaType = '';
    generateCalendar(currentAgendaType);
    autoSelectToday(); // Chama a função para selecionar automaticamente a data atual
    document.getElementById('patientName').focus();
    document.addEventListener('keydown', handleEscapeKey);
    document.getElementById('promotionType').onchange = function() {
        const otherInput = document.getElementById('otherPromotion');
        if (this.value === 'Outros') {
            otherInput.style.display = 'block';
        } else {
            otherInput.style.display = 'none';
            otherInput.value = '';
        }
    };
    const blockedGrid = document.getElementById('blockedGrid');
    const toggleBlockedBtn = document.getElementById('toggleBlockedBtn');
    if (blockedDates.length > 0 || blockedProfessionals.length > 0) {
        blockedGrid.style.display = 'grid';
        blockedGrid.classList.add('show');
        toggleBlockedBtn.textContent = 'Ocultar Datas Bloqueadas';
        isBlockedSectionOpen = true;
        displayBlocked();
    }
};
function updateScheduleButton() {
    const patientName = document.getElementById('patientName').value.trim();
    const patientCpf = document.getElementById('patientCpf').value.trim();
    const cpfValid = patientCpf ? isValidCPF(patientCpf.replace(/\D/g, '')) : true;
    const patientPhone = document.getElementById('patientPhone').value.trim();
    const phoneValid = patientPhone && (patientPhone.replace(/\D/g, '').length >= 10 && patientPhone.replace(/\D/g, '').length <= 11);
    const agendaType = document.getElementById('agendaTypeSelect').value;
    const professional = document.getElementById('dentistSelect').value;
    const location = document.getElementById('locationSelect').value;
    const priority = document.getElementById('prioritySelect').value;
    const firstAppointment = document.getElementById('firstAppointmentSelect').value;
    const btn = document.getElementById('scheduleBtn');
    const isDisabled = !patientName || !cpfValid || !phoneValid || !selectedDay || !selectedHour || !agendaType || !professional || !location || !priority || !firstAppointment;
    btn.disabled = isDisabled;
    btn.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
    btn.setAttribute('aria-label', isDisabled ? 'Agendar consulta (desabilitado até preencher todos os campos obrigatórios)' : 'Agendar consulta');
}
function generateReport() {
    const btn = document.querySelector('.report-btn');
    const spinner = document.getElementById('reportSpinner');
    btn.classList.add('loading');
    spinner.style.display = 'block';
    setTimeout(() => {
        const agendaTypeFilter = document.getElementById('reportAgendaType').value;
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;
        filteredAppointments = appointments.filter(apt => {
            if (agendaTypeFilter && apt.agendaType !== agendaTypeFilter) return false;
            if (startDate) {
                const aptDate = new Date(apt.date.split('/').reverse().join('-'));
                const start = new Date(startDate);
                if (aptDate < start) return false;
            }
            if (endDate) {
                const aptDate = new Date(apt.date.split('/').reverse().join('-'));
                const end = new Date(endDate);
                if (aptDate > end) return false;
            }
            return true;
        });
        filteredAppointments.sort((a, b) => {
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            const timeA = a.time.split(':').reduce((acc, val, idx) => acc + parseInt(val) * (idx === 0 ? 60 : 1), 0);
            const timeB = b.time.split(':').reduce((acc, val, idx) => acc + parseInt(val) * (idx === 0 ? 60 : 1), 0);
            return timeA - timeB;
        });
        const tableBody = document.getElementById('reportTableBody');
        // Adicionar cabeçalho "Motivo Inativação" ao lado de "Observações" se não existir
        const thead = document.getElementById('reportTable').querySelector('thead tr');
        if (thead.children.length === 12) {
            const newTh = document.createElement('th');
            newTh.textContent = 'Motivo Inativação';
            newTh.setAttribute('scope', 'col');
            thead.appendChild(newTh);
        }
        // Adicionar cabeçalho "Motivo Reativação" se não existir
        if (thead.children.length === 13) {
            const newTh2 = document.createElement('th');
            newTh2.textContent = 'Motivo Reativação';
            newTh2.setAttribute('scope', 'col');
            thead.appendChild(newTh2);
        }
        tableBody.innerHTML = '';
        filteredAppointments.forEach((apt, index) => {
            const row = tableBody.insertRow();
            row.style.animationDelay = `${index * 0.05}s`;
            row.classList.add('fadeIn');
            row.insertCell(0).textContent = sanitizeInput(apt.patient);
            row.insertCell(1).textContent = apt.cpf || '';
            row.insertCell(2).textContent = apt.phone || '';
            row.insertCell(3).textContent = apt.date;
            row.insertCell(4).textContent = apt.time;
            row.insertCell(5).textContent = sanitizeInput(apt.professional);
            row.insertCell(6).textContent = apt.agendaType;
            row.insertCell(7).textContent = apt.location;
            row.insertCell(8).textContent = apt.priority || '';
            row.insertCell(9).textContent = apt.firstAppointment || '';
            const statusClass = getStatusClass(apt.status);
            row.insertCell(10).innerHTML = `<span class="status ${statusClass}">${getStatusText(apt.status)}</span>`;
            row.insertCell(11).textContent = sanitizeInput(apt.observations || '');
            // NOVA COLUNA: Motivo da Inativação (após Observações)
            const inactiveCell = row.insertCell(12);
            if (apt.status === 'inactive' && apt.inactiveReason) {
                inactiveCell.textContent = sanitizeInput(apt.inactiveReason);
                inactiveCell.title = `Motivo da inativação: ${apt.inactiveReason}`;
            } else {
                inactiveCell.textContent = '';
            }
            // NOVA COLUNA: Motivo da Reativação
            const reactivationCell = row.insertCell(13);
            if (apt.reactivationReason) {
                reactivationCell.textContent = sanitizeInput(apt.reactivationReason);
                reactivationCell.title = `Motivo da reativação: ${apt.reactivationReason}`;
            } else {
                reactivationCell.textContent = '';
            }
            // ATUALIZAÇÃO PARA INATIVO: Adicionar classe à row para fundo de acordo com status
            if (apt.status === 'inactive') {
                row.classList.add('inactive-row');
            }
        });
        const total = filteredAppointments.length;
        const odontologica = filteredAppointments.filter(apt => apt.agendaType === 'Agenda Odontológica').length;
        const medicas = filteredAppointments.filter(apt => apt.agendaType === 'Agenda Especialidades Médicas').length;
        const exames = filteredAppointments.filter(apt => apt.agendaType === 'Agenda de Exames').length;
        const summary = document.getElementById('summaryStats');
        summary.innerHTML = `
            <div class="summary-item">
                <h4>Total de Agendamentos</h4>
                <p>${total}</p>
            </div>
            <div class="summary-item">
                <h4>Odontológica</h4>
                <p>${odontologica}</p>
            </div>
            <div class="summary-item">
                <h4>Especialidades Médicas</h4>
                <p>${medicas}</p>
            </div>
            <div class="summary-item">
                <h4>Exames</h4>
                <p>${exames}</p>
            </div>
        `;
        const ctx1 = document.getElementById('reportChart').getContext('2d');
        if (reportChart) {
            reportChart.destroy();
        }
        const barTotal = odontologica + medicas + exames;
        reportChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Odontológica', 'Especialidades Médicas', 'Exames'],
                datasets: [{
                    data: [odontologica, medicas, exames],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(0, 123, 255, 0.8)',
                        'rgba(23, 162, 184, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(0, 123, 255, 1)',
                        'rgba(23, 162, 184, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Agendamentos por Tipo',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const percentage = barTotal > 0 ? ((value / barTotal) * 100).toFixed(1) : 0;
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutBounce'
                }
            }
        });
        const barPercentages = document.getElementById('barPercentages');
        barPercentages.innerHTML = `
            <p>Odontológica: ${barTotal > 0 ? ((odontologica / barTotal) * 100).toFixed(1) : 0}%</p>
            <p>Especialidades Médicas: ${barTotal > 0 ? ((medicas / barTotal) * 100).toFixed(1) : 0}%</p>
            <p>Exames: ${barTotal > 0 ? ((exames / barTotal) * 100).toFixed(1) : 0}%</p>
        `;
        const attended = filteredAppointments.filter(apt => apt.status === 'attended').length;
        const noShow = filteredAppointments.filter(apt => apt.status === 'no-show').length;
        const rescheduled = filteredAppointments.filter(apt => apt.status === 'rescheduled').length;
        const inactive = filteredAppointments.filter(apt => apt.status === 'inactive').length;
        const pending = filteredAppointments.length - attended - noShow - rescheduled - inactive;
        const ctx2 = document.getElementById('attendanceChart').getContext('2d');
        if (attendanceChart) {
            attendanceChart.destroy();
        }
        const attendanceTotal = attended + noShow + pending + rescheduled + inactive;
        attendanceChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Compareceu', 'Não Compareceu', 'Pendente', 'Reagendado', 'Inativo'],
                datasets: [{
                    data: [attended, noShow, pending, rescheduled, inactive],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(255, 193, 7, 0.6)',
                        'rgba(108, 117, 125, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(220, 53, 69, 1)',
                        'rgba(255, 193, 7, 1)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(108, 117, 125, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Taxa de Comparecimento Detalhada',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const percentage = attendanceTotal > 0 ? ((value / attendanceTotal) * 100).toFixed(1) : 0;
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutBounce'
                }
            }
        });
        const barAttendancePercentages = document.getElementById('barAttendancePercentages');
        barAttendancePercentages.innerHTML = `
            <p>Compareceu: ${attendanceTotal > 0 ? ((attended / attendanceTotal) * 100).toFixed(1) : 0}%</p>
            <p>Não Compareceu: ${attendanceTotal > 0 ? ((noShow / attendanceTotal) * 100).toFixed(1) : 0}%</p>
            <p>Pendente: ${attendanceTotal > 0 ? ((pending / attendanceTotal) * 100).toFixed(1) : 0}%</p>
            <p>Reagendado: ${attendanceTotal > 0 ? ((rescheduled / attendanceTotal) * 100).toFixed(1) : 0}%</p>
            <p>Inativo: ${attendanceTotal > 0 ? ((inactive / attendanceTotal) * 100).toFixed(1) : 0}%</p>
        `;
        const profCounts = {};
        filteredAppointments.forEach(apt => {
            profCounts[apt.professional] = (profCounts[apt.professional] || 0) + 1;
        });
        const profEntries = Object.entries(profCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const profLabels = profEntries.map(entry => entry[0]);
        const profData = profEntries.map(entry => entry[1]);
        const profTotal = Object.values(profCounts).reduce((sum, count) => sum + count, 0);
        const ctx3 = document.getElementById('productivityChart').getContext('2d');
        if (productivityChart) {
            productivityChart.destroy();
        }
        productivityChart = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: profLabels,
                datasets: [{
                    data: profData,
                    backgroundColor: 'rgba(153, 102, 255, 0.8)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Produtividade por Profissional (Top 5)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const percentage = profTotal > 0 ? ((value / profTotal) * 100).toFixed(1) : 0;
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutBounce'
                }
            }
        });
        const productivityPercentages = document.getElementById('productivityPercentages');
        productivityPercentages.innerHTML = profEntries.map(entry => `<p>${entry[0]}: ${((entry[1] / profTotal) * 100).toFixed(1)}%</p>`).join('');
        document.getElementById('reportTableContainer').style.display = 'block';
        document.getElementById('exportBtn').style.display = 'inline-block';
        btn.classList.remove('loading');
        spinner.style.display = 'none';
    }, 500);
}
// Updated exportToExcel to include inactive reason column
function exportToExcel() {
    if (filteredAppointments.length === 0) {
        showToast('Nenhum relatório para exportar.', 'error');
        return;
    }
    const headers = ['Paciente', 'CPF', 'Telefone', 'Data', 'Horário', 'Profissional', 'Tipo', 'Local', 'Prioritário', 'Primeiro Atendimento', 'Status', 'Observações', 'Motivo Inativação', 'Motivo Reativação'];
    const data = [
        headers,
        ...filteredAppointments.map(apt => [
            apt.patient,
            apt.cpf || '',
            apt.phone || '',
            apt.date,
            apt.time,
            apt.professional,
            apt.agendaType,
            apt.location,
            apt.priority || '',
            apt.firstAppointment || '',
            getStatusText(apt.status),
            apt.observations || '',
            apt.status === 'inactive' ? (apt.inactiveReason || '') : '',
            apt.reactivationReason || ''
        ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    for(let col=0; col<headers.length; col++){
        const cell_address = XLSX.utils.encode_cell({r:0, c:col});
        if(!ws[cell_address]) continue;
        ws[cell_address].s = {
            font: { bold: true, color: {rgb: "FFFFFF"} },
            fill: { fgColor: {rgb: "007BFF"} },
            alignment: { horizontal: "center", vertical: "center" }
        };
    }
    for(let row=1; row<data.length; row++){
        const rowColor = row % 2 === 0 ? "F8F9FA" : "FFFFFF";
        for(let col=0; col<headers.length; col++){
            const cell_address = XLSX.utils.encode_cell({r:row, c:col});
            if(!ws[cell_address]) continue;
            ws[cell_address].s = {
                fill: { fgColor: {rgb: rowColor} },
                alignment: { wrapText: true, vertical: "center" }
            };
        }
    }
    for(let row=1; row<data.length; row++){
        const status = data[row][10];
        let statusColor = "000000";
        if(status === 'Compareceu') statusColor = "155724";
        else if(status === 'Não Compareceu') statusColor = "721C24";
        else if(status === 'Reagendado') statusColor = "856404";
        else if(status === 'Inativo') statusColor = "6C757D";
        else statusColor = "383D41";
        const cell_address = XLSX.utils.encode_cell({r:row, c:10});
        if(!ws[cell_address]) continue;
        ws[cell_address].s = {
            font: { bold: true, color: {rgb: statusColor} },
            fill: { fgColor: {rgb: "FFFFFF"} },
            alignment: { horizontal: "center", vertical: "center" }
        };
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório de Agendamentos');
    XLSX.writeFile(wb, `relatorio_agendamentos_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Relatório exportado para Excel com cores! ✅');
}