const templates = [
    { id: 'modern-minimal', name: 'Modern Minimal', desc: 'Clean, crisp, and extremely professional.', cssClass: 'tpl-modern-minimal' },
    { id: 'dark-glass', name: 'Dark Glassmorphism', desc: 'Sleek dark theme with frosted glass overlays.', cssClass: 'tpl-dark-glass' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'High-tech aesthetics with glowing outlines.', cssClass: 'tpl-cyberpunk' },
    { id: 'neon-nights', name: 'Neon Nights', desc: 'Vibrant purple and pink synthwave gradients.', cssClass: 'tpl-neon-nights' },
    { id: 'creative-split', name: 'Creative Split', desc: 'Bold two-column asymmetrical layout.', cssClass: 'tpl-creative-split' },
    { id: 'executive', name: 'Executive Suite', desc: 'Classic navy hierarchy and traditional structure.', cssClass: 'tpl-executive' },
    { id: 'monochrome', name: 'Brutal Monochrome', desc: 'Stark black and white, max contrast design.', cssClass: 'tpl-monochrome' },
    { id: 'soft-pastel', name: 'Soft Pastel', desc: 'Friendly, bubbly, approachable and soft.', cssClass: 'tpl-soft-pastel' },
    { id: 'retro-terminal', name: 'Retro Terminal', desc: 'Green phosphor on deep black tech style.', cssClass: 'tpl-retro-terminal' },
    { id: 'holographic', name: 'Holographic', desc: 'Iridescent backgrounds and glass layering.', cssClass: 'tpl-holographic' },
    { id: 'material-design', name: 'Material Design', desc: 'Strong drop shadows and floating actions.', cssClass: 'tpl-material-design' },
    { id: 'vintage-paper', name: 'Vintage Paper', desc: 'Sepia tones, dashed lines, historic feel.', cssClass: 'tpl-vintage-paper' },
    { id: 'gradient-mesh', name: 'Gradient Mesh', desc: 'Fluid organic meshes forming the background.', cssClass: 'tpl-gradient-mesh' },
    { id: 'tech-blueprint', name: 'Tech Blueprint', desc: 'Blue drafting grid with precise dashed lines.', cssClass: 'tpl-tech-blueprint' },
    { id: 'startup-bold', name: 'Startup Bold', desc: 'Asymmetrical disruption with big vibrant blocks.', cssClass: 'tpl-startup-bold' },
    { id: 'elegant-serif', name: 'Elegant Serif', desc: 'Beige backgrounds and high-luxury maroon accents.', cssClass: 'tpl-elegant-serif' }
];

document.addEventListener('DOMContentLoaded', () => {
    const usernameDisplay = document.getElementById('username-display');
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'auth.html';
        return;
    }
    usernameDisplay.textContent = loggedInUser;

    const grid = document.getElementById('templates-grid');

    templates.forEach(tpl => {
        const card = document.createElement('div');
        card.className = `template-card ${tpl.cssClass}`;
        card.dataset.id = tpl.id;

        card.innerHTML = `
            <div class="pv-window">
                <div class="resume-wrapper ${tpl.cssClass} preview-mode">
                    <div class="resume-header">
                        <div class="prev-name-placeholder"></div>
                        <div class="prev-title-placeholder"></div>
                        <div class="resume-contact">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                    <div class="resume-section">
                        <div class="section-title">Experience</div>
                        <div class="resume-item">
                            <div class="item-header">
                                <div class="item-title"><strong></strong><span></span></div>
                                <div class="item-date"></div>
                            </div>
                            <ul class="item-desc"><li></li><li></li></ul>
                        </div>
                    </div>
                    <div class="resume-section">
                        <div class="section-title">Education</div>
                        <div class="resume-item">
                            <div class="item-header">
                                <div class="item-title"><strong></strong><span></span></div>
                            </div>
                        </div>
                    </div>
                    <div class="resume-section">
                        <div class="section-title">Skills</div>
                        <div class="skills-list">
                            <span class="skill-tag"></span><span class="skill-tag"></span><span class="skill-tag"></span>
                        </div>
                    </div>
                </div>
                <div class="pv-overlay">
                    <button class="btn-select" onclick="selectTemplate('${tpl.id}')">Select Template</button>
                </div>
            </div>
            <div class="card-info">
                <h3>${tpl.name}</h3>
                <p>${tpl.desc}</p>
            </div>
        `;
        grid.appendChild(card);
    });
});

window.selectTemplate = (templateId) => {
    localStorage.setItem('selectedTemplate', templateId);
    window.location.href = `builder.html?template=${templateId}`;
};
