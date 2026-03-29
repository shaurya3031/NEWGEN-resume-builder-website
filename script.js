document.addEventListener('DOMContentLoaded', () => {

    // --- Template Initialization Logic ---
    const resumePreview = document.getElementById('resumePreview');
    
    // Read from URL or fallback to localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let selectedTemplate = urlParams.get('template') || localStorage.getItem('selectedTemplate') || 'modern-minimal';
    
    // Mount the template class directly to the preview
    resumePreview.className = `resume-wrapper tpl-${selectedTemplate}`;


    // --- Advanced Features: PDF Export ---
    const btnExport = document.getElementById('btnExport');
    btnExport.addEventListener('click', () => {
        // High Quality PDF render using html2pdf
        const oldTransform = resumePreview.style.transform;
        
        // Remove transform scaling briefly for an accurate 1:1 render
        resumePreview.style.transform = 'none';
        
        const opt = {
            margin:       [-0.1, 0, 0, 0], // Slight negative top margin to avoid clipping
            filename:     'NextGen-Resume.pdf',
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generating...
        html2pdf().set(opt).from(resumePreview).save().then(() => {
            // Restore scale
            resumePreview.style.transform = oldTransform || '';
        });
    });

    // --- Real-time Data Binding ---
    const textBindings = [
        { inp: 'inp-name', prev: 'prev-name', default: 'John Doe' },
        { inp: 'inp-title', prev: 'prev-title', default: 'Software Engineer' },
        { inp: 'inp-email', prev: 'prev-email', default: 'john@example.com' },
        { inp: 'inp-phone', prev: 'prev-phone', default: '(123) 456-7890' },
        { inp: 'inp-location', prev: 'prev-location', default: 'City, State' },
        { inp: 'inp-website', prev: 'prev-website', default: 'linkedin.com/in/johndoe' },
        { inp: 'inp-summary', prev: 'prev-summary', default: 'Briefly describe your career highlights and goals...' },
    ];

    // Simple text fields
    textBindings.forEach(b => {
        const inputEl = document.getElementById(b.inp);
        const prevEl = document.getElementById(b.prev);
        if (inputEl && prevEl) {
            inputEl.addEventListener('input', (e) => {
                prevEl.textContent = e.target.value || b.default;
            });
        }
    });

    // Skills logic (comma separated tags)
    const inpSkills = document.getElementById('inp-skills');
    const prevSkills = document.getElementById('prev-skills');
    
    inpSkills.addEventListener('input', (e) => {
        const skillsArr = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
        
        if (skillsArr.length === 0) {
            prevSkills.innerHTML = `
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">React</span>
                <span class="skill-tag">CSS</span>
                <span class="skill-tag">Node.js</span>
            `;
            return;
        }

        prevSkills.innerHTML = '';
        skillsArr.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'skill-tag';
            span.textContent = skill;
            prevSkills.appendChild(span);
        });
    });

    // --- Dynamic Lists Logic (Experience & Education) ---
    const experienceList = document.getElementById('experienceList');
    const btnAddExp = document.getElementById('btnAddExp');
    const prevExperienceList = document.getElementById('prev-experience-list');
    let expCount = 1;

    // Helper: binds a dynamic input inside an item form to its corresponding preview element
    const bindDynamicInput = (inputEl) => {
        inputEl.addEventListener('input', (e) => {
            const targetId = inputEl.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                if (targetId.includes('desc')) {
                    // special handling for description list
                    const lines = e.target.value.split('\n').filter(l => l.trim() !== '');
                    targetEl.innerHTML = '';
                    if (lines.length === 0) {
                        targetEl.innerHTML = `<li>Description point 1...</li>`;
                    } else {
                        lines.forEach(line => {
                            const li = document.createElement('li');
                            // Remove leading hyphens if user typed them
                            li.textContent = line.replace(/^-/, '').trim();
                            targetEl.appendChild(li);
                        });
                    }
                } else {
                    targetEl.textContent = e.target.value || '...';
                }
            }
        });
    };

    // Bind initial static nodes
    document.querySelectorAll('.dyn-inp').forEach(bindDynamicInput);

    btnAddExp.addEventListener('click', () => {
        expCount++;
        const expId = `exp-${expCount}`;

        // Create form item
        const formHtml = `
            <div class="item-form" id="form-${expId}" data-id="${expId}">
                <button class="btn-remove" onclick="removeExp('${expId}')">Remove</button>
                <div class="input-group">
                    <label>Job Title</label>
                    <input type="text" class="dyn-inp" data-target="prev-${expId}-title" placeholder="Position title">
                </div>
                <div class="input-group">
                    <label>Company</label>
                    <input type="text" class="dyn-inp" data-target="prev-${expId}-company" placeholder="Company Name">
                </div>
                <div class="row">
                    <div class="input-group">
                        <label>Start Date</label>
                        <input type="text" class="dyn-inp" data-target="prev-${expId}-start" placeholder="MM/YYYY">
                    </div>
                    <div class="input-group">
                        <label>End Date</label>
                        <input type="text" class="dyn-inp" data-target="prev-${expId}-end" placeholder="MM/YYYY">
                    </div>
                </div>
                <div class="input-group">
                    <label>Description</label>
                    <textarea class="dyn-inp" data-target="prev-${expId}-desc" rows="3">- ...</textarea>
                </div>
            </div>
        `;
        experienceList.insertAdjacentHTML('beforeend', formHtml);

        // Create preview item
        const prevHtml = `
            <div class="resume-item" id="prev-${expId}">
                <div class="item-header">
                    <div class="item-title">
                        <strong id="prev-${expId}-title">Position Title</strong>
                        <span class="item-company" id="prev-${expId}-company">Company Name</span>
                    </div>
                    <div class="item-date">
                        <span id="prev-${expId}-start">Start</span> - <span id="prev-${expId}-end">End</span>
                    </div>
                </div>
                <ul class="item-desc" id="prev-${expId}-desc">
                    <li>...</li>
                </ul>
            </div>
        `;
        prevExperienceList.insertAdjacentHTML('beforeend', prevHtml);

        // Bind new inputs
        document.querySelectorAll(`#form-${expId} .dyn-inp`).forEach(bindDynamicInput);
    });

    window.removeExp = (id) => {
        const formEl = document.getElementById(`form-${id}`);
        const prevEl = document.getElementById(`prev-${id}`);
        
        // CSS Animation out
        formEl.style.animation = 'popOut 0.3s var(--ease-out) forwards';
        prevEl.style.opacity = '0';
        prevEl.style.transition = 'opacity 0.3s';
        
        setTimeout(() => {
            formEl.remove();
            prevEl.remove();
        }, 300);
    };

    // Education Dynamic List
    const educationList = document.getElementById('educationList');
    const btnAddEdu = document.getElementById('btnAddEdu');
    const prevEducationList = document.getElementById('prev-education-list');
    let eduCount = 1;

    btnAddEdu.addEventListener('click', () => {
        eduCount++;
        const eduId = `edu-${eduCount}`;

        // Form
        const formHtml = `
            <div class="item-form" id="form-${eduId}" data-id="${eduId}">
                 <button class="btn-remove" onclick="removeEdu('${eduId}')">Remove</button>
                <div class="input-group">
                    <label>Degree</label>
                    <input type="text" class="dyn-inp" data-target="prev-${eduId}-degree" placeholder="Degree Name">
                </div>
                <div class="input-group">
                    <label>University / School</label>
                    <input type="text" class="dyn-inp" data-target="prev-${eduId}-school" placeholder="Institution Name">
                </div>
                <div class="row">
                    <div class="input-group">
                        <label>Start Date</label>
                        <input type="text" class="dyn-inp" data-target="prev-${eduId}-start" placeholder="Year">
                    </div>
                    <div class="input-group">
                        <label>End Date</label>
                        <input type="text" class="dyn-inp" data-target="prev-${eduId}-end" placeholder="Year">
                    </div>
                </div>
            </div>
        `;
        educationList.insertAdjacentHTML('beforeend', formHtml);

        // Preview
        const prevHtml = `
            <div class="resume-item" id="prev-${eduId}">
                <div class="item-header">
                    <div class="item-title">
                        <strong id="prev-${eduId}-degree">Degree Name</strong>
                        <span class="item-company" id="prev-${eduId}-school">Institution Name</span>
                    </div>
                    <div class="item-date">
                        <span id="prev-${eduId}-start">Start</span> - <span id="prev-${eduId}-end">End</span>
                    </div>
                </div>
            </div>
        `;
        prevEducationList.insertAdjacentHTML('beforeend', prevHtml);

        // Bind
        document.querySelectorAll(`#form-${eduId} .dyn-inp`).forEach(bindDynamicInput);
    });

    window.removeEdu = (id) => {
        const formEl = document.getElementById(`form-${id}`);
        const prevEl = document.getElementById(`prev-${id}`);
        
        // CSS Animation out
        formEl.style.animation = 'popOut 0.3s var(--ease-out) forwards';
        prevEl.style.opacity = '0';
        prevEl.style.transition = 'opacity 0.3s';
        
        setTimeout(() => {
            formEl.remove();
            prevEl.remove();
        }, 300);
    };

    // --- Interactive 3D Tilt Effect on Preview ---
    const previewPanel = document.querySelector('.preview-panel');
    previewPanel.addEventListener('mousemove', (e) => {
        // Only run if not on mobile/tablet view
        if (window.innerWidth < 1024) return;
        
        const rect = previewPanel.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -2; // max rotation degrees
        const rotateY = ((x - centerX) / centerX) * 2;
        
        resumePreview.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        resumePreview.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 10}px 30px rgba(0,0,0,0.1)`;
    });

    previewPanel.addEventListener('mouseleave', () => {
        resumePreview.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        resumePreview.style.boxShadow = 'var(--shadow-lg)';
    });

});
