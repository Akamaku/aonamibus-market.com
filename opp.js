// 状態管理
let isLoggedIn = false;
const adminInquiryEmail = "Aonamibus.market50@gmail.com";

// 15台分のダミーデータ
const vehicles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    name: `日野 セレガ 201${i % 9}`,
    manufacturer: "日野",
    size: "大型",
    status: i === 0 ? "SOLD" : "AVAILABLE",
    condition: "白煙を噴くが自走可能"
}));

// リスト表示
function renderVehicles() {
    const list = document.getElementById('vehicle-list');
    vehicles.forEach(v => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            ${v.status === 'SOLD' ? '<div class="soldout-overlay">SOLDOUT</div>' : ''}
            <div>
                <h3>${v.name}</h3>
                <p>${v.manufacturer} / ${v.size} / ${v.condition}</p>
                <button class="btn-red" onclick="openDetail(${v.id})">詳細・問い合わせ</button>
                <span class="report-btn" onclick="report(${v.id})">🚩報告</span>
            </div>
        `;
        list.appendChild(card);
    });
}

// コメント欄の制御
function openDetail(id) {
    const modal = document.getElementById('detail-modal');
    const alertBar = document.getElementById('comment-alert');
    const input = document.getElementById('comment-input');

    modal.style.display = "block";

    if (!isLoggedIn) {
        input.disabled = true;
        alertBar.innerText = "⚠️ 会員以外はコメントできません。Gmailでログインしてください。";
        alertBar.style.display = "block";
    }
}

// 簡易ログイン（Gmailバリデーション）
function showLogin() {
    const email = prompt("Gmailアドレスを入力してください:");
    if (email && email.endsWith("@gmail.com")) {
        isLoggedIn = true;
        alert("ログインしました（ID保存完了）");
        document.getElementById('auth-section').innerText = email;
    } else {
        alert("Gmail以外は登録できません。");
    }
}
// 擬似データベース（実際はFirebaseなどのDBから取得）
let vehicleData = JSON.parse(localStorage.getItem('allVehicles')) || [];

// 新着順にソートする関数
function getLatestVehicles() {
    // 投稿日時(createdAt)で降順ソート
    return vehicleData.sort((a, b) => b.createdAt - a.createdAt);
}

// リスト表示を更新する関数
function renderList() {
    const grid = document.getElementById('vehicle-grid');
    grid.innerHTML = ''; // 一旦クリア
    
    const latest = getLatestVehicles();
    
    latest.forEach(v => {
        const card = document.createElement('div');
        card.className = 'card';
        // クリックしたら detail.html へIDを渡して遷移
        card.innerHTML = `
            ${v.sold ? '<div class="sold-out">SOLDOUT</div>' : ''}
            <div class="card-img">📷 写真</div>
            <div class="card-content">
                <h3 class="card-title">${v.title}</h3>
                <p>サイズ：${v.size} / 状態：${v.condition}</p>
                <a href="detail.html?id=${v.id}" class="btn-detail text-white">詳細を見る</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.onload = renderVehicles;