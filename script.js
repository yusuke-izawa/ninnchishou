// Data for Step 1 & 2
const symptomData = [
    {
        id: 's1',
        label: '落ち着かない・そわそわする',
        sub: '（徘徊・不穏・多動）',
        details: [
            '夕方から強くなる（夕暮れ症候群）',
            '目的が定まらず歩き回る（徘徊）',
            '座っていられない（多動）',
            '声かけで不安が強まる',
            '何かを探している様子'
        ]
    },
    {
        id: 's2',
        label: '怒りっぽい・拒否が強い',
        sub: '（易怒性・介護拒否）',
        details: [
            '入浴を嫌がる',
            '着替えを拒否する',
            '特定のスタッフにだけ強い口調',
            '理由なく怒り出す'
        ]
    },
    {
        id: 's3',
        label: '不安が強い・怖がる',
        sub: '（不安・恐怖・被害妄想）',
        details: [
            '誰かが悪口を言っていると言う',
            '物が盗まれたと言う（物盗られ妄想）',
            '一人になるのを極端に怖がる'
        ]
    },
    {
        id: 's4',
        label: '同じことを何度も言う・聞く',
        sub: '（常同行動・反復言動）',
        details: []
    }
];

const tagsEnv = ['夕方〜夜に起きやすい', '見学や訪問者が来た', '音・人の出入りが多い', 'テレビやラジオが気になる'];
const tagsBody = ['眠れていない', '便秘・排泄不快', '痛みを訴えている', '暖かさをとる'];
const tagsCare = ['声かけが多かった', '急がせてしまった', '説得しようとした'];

// State
let currentStep = 0;
let answers = {
    mainSymptom: null, // Index
    detailSymptoms: [], // Indices
    envTags: [],
    bodyTags: [],
    careTags: [],
    meds: '',
    free: ''
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initStep1();
    initStep3();
});

// Navigation
function goToStep(step) {
    if (step === 2 && answers.mainSymptom === null) {
        alert('ひとつ選んでください');
        return;
    }

    document.querySelectorAll('.screen').forEach(el => {
        el.classList.remove('active');
    });

    // Prepare Step 2 if entering
    if (step === 2) {
        initStep2();
    }

    document.getElementById(`step-${step}`) ?
        document.getElementById(`step-${step}`).classList.add('active') :
        document.getElementById('result-screen').classList.add('active');

    window.scrollTo(0, 0);
    currentStep = step;
}

// Logic Step 1
function initStep1() {
    const container = document.getElementById('step1-options');
    container.innerHTML = '';
    symptomData.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<div>${item.label}<span class="sub-note">${item.sub}</span></div>`;
        btn.onclick = () => {
            selectMainSymptom(index, btn);
        };
        container.appendChild(btn);
    });
}

function selectMainSymptom(index, btnElement) {
    answers.mainSymptom = index;
    // Highlight Single Selection
    document.querySelectorAll('#step1-options .option-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');

    // Auto advance mostly? No, wait for user. Wait, User asked for "Next" button in images?
    // Image 2 shows just options. Usually these auto-advance or have a "Next". 
    // The image 2 doesn't clearly show a "Next" button at the bottom, but logic dictates we need one or auto-advance.
    // Let's auto-advance for Step 1 as it's single choice, but maybe give a small delay.
    setTimeout(() => goToStep(2), 300);
}

// Logic Step 2
function initStep2() {
    const data = symptomData[answers.mainSymptom];
    document.getElementById('step1-context').innerText = `選んだ項目: ${data.label}`;

    const container = document.getElementById('step2-options');
    container.innerHTML = '';

    data.details.forEach((detail, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = detail;
        btn.onclick = () => {
            toggleDetail(idx, btn);
        };
        container.appendChild(btn);
    });

    if (data.details.length === 0) {
        container.innerHTML = '<p>（詳細項目はありません。次へ進んでください）</p>';
    }
}

function toggleDetail(idx, btn) {
    btn.classList.toggle('selected');
    const selected = answers.detailSymptoms;
    if (selected.includes(idx)) {
        answers.detailSymptoms = selected.filter(i => i !== idx);
    } else {
        answers.detailSymptoms.push(idx);
    }
}

// Logic Step 3
function initStep3() {
    renderTags('step3-tags-env', tagsEnv, 'envTags');
    renderTags('step3-tags-body', tagsBody, 'bodyTags');
    renderTags('step3-tags-care', tagsCare, 'careTags');
}

function renderTags(containerId, tags, modelKey) {
    const container = document.getElementById(containerId);
    tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.innerText = tag;
        btn.onclick = () => {
            btn.classList.toggle('selected');
            const list = answers[modelKey];
            if (list.includes(tag)) {
                answers[modelKey] = list.filter(t => t !== tag);
            } else {
                answers[modelKey].push(tag);
            }
        };
        container.appendChild(btn);
    });
}

// Result Generation
function generateResult() {
    answers.meds = document.getElementById('medication-input').value;
    answers.free = document.getElementById('free-input').value;

    // Fill Result Content
    const mainSymptomLabel = symptomData[answers.mainSymptom].label;

    document.getElementById('result-priority-content').innerHTML = `
        <ul style="padding-left: 20px; margin: 0;">
            <li>困っている行動には理由があることが多い。まずはよく話を聴き、安心できるような声かけを増やしてみましょう！</li>
            <li><strong>${mainSymptomLabel}</strong> が見られています。不安の軽減が最優先です。</li>
        </ul>
    `;

    document.getElementById('result-hints-content').innerHTML = `
        <p><strong>・安心できる環境づくり</strong><br>
        背中をさすったり、温かい飲み物を提供して落ち着きを取り戻しましょう。</p>
        <p><strong>・否定しない</strong><br>
        「家に帰りたいんですね、一緒に帰って旦那さん待ってますかね？」と受容的に会話をつなげましょう。</p>
        <p><strong>・${answers.envTags.length > 0 ? '環境調整' : '観察'}</strong><br>
        ${answers.envTags.join('、')} などが影響している可能性があります。刺激を減らしてみてください。</p>
    `;

    const medsText = answers.meds ? answers.meds : "入力なし";
    document.getElementById('result-meds-content').innerHTML = `
        <p>${medsText} <span style="font-size:12px; color:#666;">※これらが影響している可能性も考慮しましょう。</span></p>
    `;

    document.getElementById('result-type-content').innerHTML = `
        <ul style="padding-left: 20px; margin: 0;">
            <li>アルツハイマー型認知症の可能性</li>
            <li>前頭側頭型認知症の可能性（常同行動がある場合）</li>
        </ul>
    `;

    goToStep('result-screen'); // Actually handled by logic above, but custom string works if Logic allows. 
    // Fix: goToStep expects number usually, but I used string ID logic check.
    // Let's adhere to "screen active" logic directly here.
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById('result-screen').classList.add('active');
    window.scrollTo(0, 0);
}
