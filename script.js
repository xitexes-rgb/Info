document.getElementById('search-btn').addEventListener('click', async () => {
    const uid = document.getElementById('uid-input').value.trim();
    const region = document.getElementById('region-input').value;
    const resultContainer = document.getElementById('result-container');

    if (!uid) {
        alert('Please enter a valid UID');
        return;
    }

    resultContainer.classList.remove('hidden', 'success');
    resultContainer.innerHTML = `<p style="color: #9ca3af;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching player info...</p>`;

    try {
        const response = await window.fetch(`/api/player?uid=${uid}&region=${region}`);
        const data = await response.json();

        if (data.error) {
            resultContainer.className = "result-card";
            resultContainer.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 24px; color: #ef4444; margin-bottom: 8px;"></i>
                <p style="color: #ef4444; font-weight: 600; margin-bottom: 4px;">Failed to fetch</p>
                <p style="font-size: 13px; color: #9ca3af;">${data.message || 'Check UID/region or try again later.'}</p>
            `;
        } else {
            resultContainer.className = "result-card success";
            resultContainer.innerHTML = `
                <h3 style="margin-bottom: 8px; color: #34d399;">${data.accountName || 'Player Found'}</h3>
                <p style="font-size: 13px; color: #d1d5db;">Level: ${data.accountLevel || 'N/A'}</p>
                <p style="font-size: 13px; color: #d1d5db;">Likes: ${data.likes || 'N/A'}</p>
            `;
        }
    } catch (err) {
        resultContainer.className = "result-card";
        resultContainer.innerHTML = `
            <i class="fa-solid fa-circle-exclamation" style="font-size: 24px; color: #ef4444; margin-bottom: 8px;"></i>
            <p style="color: #ef4444; font-weight: 600; margin-bottom: 4px;">Failed to fetch</p>
            <p style="font-size: 13px; color: #9ca3af;">Check UID/region or try again later.</p>
        `;
    }
});

document.getElementById('refresh-btn').addEventListener('click', () => {
    location.reload();
});
