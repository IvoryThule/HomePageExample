/* =====================
   Apple Style Portfolio JavaScript
   ===================== */

// Global Variables
let isDarkMode = false;
let currentLanguage = 'en';

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const entryCards = document.querySelectorAll('.entry-card');
const projectCards = document.querySelectorAll('.project-card');
const projectSections = document.querySelectorAll('.project-section');

// Initialize
function init() {
    initTheme();
    initThemeToggle();
    initLanguage();
    initLanguageToggle();
    initAvatarUpload();
    initCardTilt();
    initRippleEffect();
    initSmoothScroll();
    initScrollAnimations();
    initPageLoadAnimation();
    initEditMode();
}

// Initialize Theme
function initTheme() {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Theme Toggle
function initThemeToggle() {
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Initialize Language
function initLanguage() {
    // Check localStorage for saved language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    } else {
        // 强制默认使用中文
        currentLanguage = 'zh';
    }
    updateLanguageUI();
}

// Language Toggle
function initLanguageToggle() {
    const languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
        const languageBtns = languageToggle.querySelectorAll('.language-btn');
        languageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (lang !== currentLanguage) {
                    currentLanguage = lang;
                    localStorage.setItem('language', lang);
                    updateLanguageUI();
                    updatePageContent();
                }
            });
        });
    }
}

// Update Language UI
function updateLanguageUI() {
    const languageBtns = document.querySelectorAll('.language-btn');
    languageBtns.forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Update Page Content
function updatePageContent() {
    // Define translations
    const translations = {
        en: {
            nav: {
                home: 'Home',
                about: 'About',
                works: 'Works',
                writing: 'Writing'
            },
            hero: {
                tagline: 'Design Engineer · Hong Kong'
            },
            entryCards: {
                about: 'About',
                aboutDesc: 'Learn about my background, skills, and approach to design engineering',
                works: 'Works',
                worksDesc: 'Explore my portfolio of digital products and design projects',
                writing: 'Writing',
                writingDesc: 'Read my thoughts on design, technology, and creative process'
            },
            about: {
                title: 'About',
                content: [
                    'Hello, I\'m IvoryThule, a design engineer based in Hong Kong. I specialize in creating digital products that balance beautiful design with technical excellence.',
                    'With over 8 years of experience in the industry, I\'ve worked with startups, agencies, and Fortune 500 companies to bring innovative products to life. My approach combines user-centered design principles with clean, efficient engineering practices.',
                    'I believe that great design is not just about aesthetics, but about creating meaningful experiences that solve real problems. Every project I work on starts with a deep understanding of the user\'s needs and ends with a polished product that exceeds expectations.',
                    'When I\'m not designing or coding, you can find me exploring the vibrant streets of Hong Kong, capturing moments with my camera, or experimenting with new recipes in the kitchen.',
                    'Skills'
                ],
                skills: 'Design: UI/UX Design, Interaction Design, Prototyping, Visual Design\nDevelopment: HTML, CSS, JavaScript, React, Node.js, TypeScript\nTools: Figma, Sketch, Adobe Creative Suite, VS Code, Git'
            },
            works: {
                title: 'Works',
                subtitle: 'Explore my portfolio of digital products and design projects',
                projects: [
                    { title: 'Nova Finance App', tagline: 'Modern banking experience with intuitive UI' },
                    { title: 'Aura Health Platform', tagline: 'Wellness app with personalized insights' },
                    { title: 'Lume Smart Home', tagline: 'Connected home control system' },
                    { title: 'Echo Audio Player', tagline: 'Premium music streaming experience' },
                    { title: 'Pulse Fitness Tracker', tagline: 'Health monitoring with clean data visualization' },
                    { title: 'Canvas Design Tool', tagline: 'Collaborative creative workspace' }
                ]
            },
            project: {
                title: 'Nova Finance App',
                subtitle: 'Modern banking experience with intuitive UI',
                sections: {
                    overview: 'Overview',
                    overviewContent: [
                        'Nova Finance is a modern banking application designed to simplify personal finance management. The app features an intuitive user interface that makes it easy for users to track expenses, manage budgets, and make informed financial decisions.',
                        'With a focus on clean design and user experience, Nova Finance provides a seamless banking experience that feels both premium and accessible. The app\'s interface uses a minimalist approach with subtle animations and transitions to create a sense of elegance and sophistication.'
                    ],
                    designProcess: 'Design Process',
                    designProcessContent: [
                        'The design process for Nova Finance began with extensive user research to understand the pain points of existing banking apps. Through interviews and usability testing, we identified key areas for improvement, including navigation complexity, data visualization, and overall user experience.',
                        'We then moved into the wireframing and prototyping phase, creating multiple iterations of the app\'s interface. Each iteration was tested with users to gather feedback and refine the design. This iterative process allowed us to create a product that truly meets the needs of its users.'
                    ],
                    features: 'Key Features',
                    featuresContent: 'Nova Finance includes a range of features designed to make personal finance management simple and intuitive:',
                    featuresList: [
                        'Real-time expense tracking',
                        'Personalized budget recommendations',
                        'Secure biometric authentication',
                        'Investment portfolio analysis',
                        'Bills and subscription management',
                        'Financial health insights'
                    ],
                    technology: 'Technology',
                    technologyContent: 'The Nova Finance app was built using a modern tech stack to ensure performance, security, and scalability:',
                    technologyDetails: 'Frontend: React Native, TypeScript, Expo\nBackend: Node.js, Express, MongoDB\nSecurity: OAuth 2.0, SSL encryption, biometric authentication\nAnalytics: Firebase, Mixpanel',
                    results: 'Results',
                    resultsContent: [
                        'Since its launch, Nova Finance has received positive feedback from users and critics alike. The app has been praised for its intuitive design, powerful features, and overall user experience.',
                        'Key metrics include:'
                    ],
                    resultsList: [
                        '4.9/5 App Store rating',
                        'Over 100,000 downloads in the first month',
                        '85% user retention rate',
                        'Featured in Apple\'s "Apps We Love" section'
                    ]
                }
            },
            writing: {
                title: 'Writing',
                subtitle: 'Thoughts on design, technology, and creative process',
                articles: [
                    { title: 'The Future of UI Design', date: 'March 15, 2026', content: 'Exploring the evolving landscape of user interface design and how emerging technologies are shaping the future of digital experiences. From AI-powered interfaces to immersive AR/VR experiences, the future of UI design is more exciting than ever.' },
                    { title: 'Designing for Accessibility', date: 'February 28, 2026', content: 'Creating digital products that are accessible to everyone is not just a legal requirement, but a moral imperative. This article explores best practices for designing accessible interfaces and the impact it has on user experience.' },
                    { title: 'The Role of Design Systems', date: 'January 20, 2026', content: 'Design systems have become an essential tool for modern product teams. This article discusses how design systems can improve collaboration, consistency, and efficiency in the design and development process.' },
                    { title: 'Mindfulness in Design', date: 'December 10, 2025', content: 'In a world of constant distractions, designing with mindfulness can create more meaningful experiences. This article explores how mindfulness principles can be applied to the design process and the impact it has on users.' },
                    { title: 'The Ethics of AI in Design', date: 'November 5, 2025', content: 'As AI becomes more integrated into the design process, it\'s important to consider the ethical implications. This article discusses the responsible use of AI in design and the potential impact on creativity and human connection.' }
                ],
                readMore: 'Read More'
            },
            footer: {
                copyright: '© 2026 IvoryThule. All rights reserved.'
            }
        },
        zh: {
            nav: {
                home: '首页',
                about: '关于',
                works: '作品',
                writing: '写作'
            },
            hero: {
                tagline: '设计工程师 · 香港'
            },
            entryCards: {
                about: '关于',
                aboutDesc: '了解我的背景、技能和设计工程方法',
                works: '作品',
                worksDesc: '探索我的数字产品和设计项目组合',
                writing: '写作',
                writingDesc: '阅读我对设计、技术和创意过程的思考'
            },
            about: {
                title: '关于',
                content: [
                    '你好，我是IvoryThule，一位来自香港的设计工程师。我专注于创建平衡美观设计与技术卓越的数字产品。',
                    '凭借超过8年的行业经验，我曾与初创公司、机构和财富500强公司合作，将创新产品变为现实。我的方法结合了以用户为中心的设计原则和简洁高效的工程实践。',
                    '我相信优秀的设计不仅仅关乎美学，更关乎创造解决实际问题的有意义体验。我参与的每个项目都始于对用户需求的深刻理解，终于超越期望的精致产品。',
                    '当我不设计或编码时，你可以发现我在探索香港充满活力的街道，用相机捕捉瞬间，或在厨房尝试新食谱。',
                    '技能'
                ],
                skills: '设计：UI/UX设计、交互设计、原型设计、视觉设计\n开发：HTML、CSS、JavaScript、React、Node.js、TypeScript\n工具：Figma、Sketch、Adobe创意套件、VS Code、Git'
            },
            works: {
                title: '作品',
                subtitle: '探索我的数字产品和设计项目组合',
                projects: [
                    { title: 'Nova金融应用', tagline: '具有直观界面的现代银行体验' },
                    { title: 'Aura健康平台', tagline: '带有个性化洞察的健康应用' },
                    { title: 'Lume智能家居', tagline: '互联家庭控制系统' },
                    { title: 'Echo音频播放器', tagline: '优质音乐流媒体体验' },
                    { title: 'Pulse健身追踪器', tagline: '具有清晰数据可视化的健康监测' },
                    { title: 'Canvas设计工具', tagline: '协作创意工作空间' }
                ]
            },
            project: {
                title: 'Nova金融应用',
                subtitle: '具有直观界面的现代银行体验',
                sections: {
                    overview: '概述',
                    overviewContent: [
                        'Nova金融是一款现代银行应用，旨在简化个人财务管理。该应用具有直观的用户界面，使用户能够轻松跟踪支出、管理预算并做出明智的财务决策。',
                        'Nova金融注重简洁设计和用户体验，提供既高端又易于使用的无缝银行体验。应用界面采用极简主义方法，通过微妙的动画和过渡创造优雅和精致的感觉。'
                    ],
                    designProcess: '设计过程',
                    designProcessContent: [
                        'Nova金融的设计过程始于广泛的用户研究，以了解现有银行应用的痛点。通过访谈和可用性测试，我们确定了需要改进的关键领域，包括导航复杂性、数据可视化和整体用户体验。',
                        '然后我们进入线框图和原型设计阶段，创建应用界面的多个迭代版本。每个迭代版本都经过用户测试，以收集反馈并完善设计。这种迭代过程使我们能够创建真正满足用户需求的产品。'
                    ],
                    features: '主要功能',
                    featuresContent: 'Nova金融包含一系列旨在简化个人财务管理的功能：',
                    featuresList: [
                        '实时支出跟踪',
                        '个性化预算建议',
                        '安全的生物识别认证',
                        '投资组合分析',
                        '账单和订阅管理',
                        '财务健康洞察'
                    ],
                    technology: '技术',
                    technologyContent: 'Nova金融应用使用现代技术栈构建，以确保性能、安全性和可扩展性：',
                    technologyDetails: '前端：React Native、TypeScript、Expo\n后端：Node.js、Express、MongoDB\n安全：OAuth 2.0、SSL加密、生物识别认证\n分析：Firebase、Mixpanel',
                    results: '成果',
                    resultsContent: [
                        '自推出以来，Nova金融受到了用户和评论家的积极反馈。该应用因其直观的设计、强大的功能和整体用户体验而受到赞誉。',
                        '关键指标包括：'
                    ],
                    resultsList: [
                        'App Store评分4.9/5',
                        '首月下载量超过100,000次',
                        '85%的用户留存率',
                        '入选Apple的"我们喜爱的应用"部分'
                    ]
                }
            },
            writing: {
                title: '写作',
                subtitle: '关于设计、技术和创意过程的思考',
                articles: [
                    { title: 'UI设计的未来', date: '2026年3月15日', content: '探索用户界面设计的不断发展的格局，以及新兴技术如何塑造数字体验的未来。从AI驱动的界面到沉浸式AR/VR体验，UI设计的未来比以往任何时候都更加令人兴奋。' },
                    { title: '为无障碍而设计', date: '2026年2月28日', content: '创建对所有人都可访问的数字产品不仅是法律要求，也是道德责任。本文探讨了设计无障碍界面的最佳实践及其对用户体验的影响。' },
                    { title: '设计系统的作用', date: '2026年1月20日', content: '设计系统已成为现代产品团队的必备工具。本文讨论了设计系统如何改善设计和开发过程中的协作、一致性和效率。' },
                    { title: '设计中的正念', date: '2025年12月10日', content: '在一个不断分心的世界中，带着正念设计可以创造更有意义的体验。本文探讨了如何将正念原则应用于设计过程及其对用户的影响。' },
                    { title: 'AI在设计中的伦理', date: '2025年11月5日', content: '随着AI越来越融入设计过程，考虑伦理影响变得重要。本文讨论了AI在设计中的负责任使用及其对创造力和人际联系的潜在影响。' }
                ],
                readMore: '阅读更多'
            },
            footer: {
                copyright: '© 2026 IvoryThule. 保留所有权利。'
            }
        }
    };

    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length === 4) {
        navLinks[0].textContent = translations[currentLanguage].nav.home;
        navLinks[1].textContent = translations[currentLanguage].nav.about;
        navLinks[2].textContent = translations[currentLanguage].nav.works;
        navLinks[3].textContent = translations[currentLanguage].nav.writing;
    }

    // Update hero section
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        heroTagline.textContent = translations[currentLanguage].hero.tagline;
    }

    // Update entry cards
    const entryCards = document.querySelectorAll('.entry-card');
    if (entryCards.length === 3) {
        // About card
        entryCards[0].querySelector('h3').textContent = translations[currentLanguage].entryCards.about;
        entryCards[0].querySelector('p').textContent = translations[currentLanguage].entryCards.aboutDesc;
        // Works card
        entryCards[1].querySelector('h3').textContent = translations[currentLanguage].entryCards.works;
        entryCards[1].querySelector('p').textContent = translations[currentLanguage].entryCards.worksDesc;
        // Writing card
        entryCards[2].querySelector('h3').textContent = translations[currentLanguage].entryCards.writing;
        entryCards[2].querySelector('p').textContent = translations[currentLanguage].entryCards.writingDesc;
    }

    // Update about page
    const aboutTitle = document.querySelector('.about h2');
    if (aboutTitle) {
        aboutTitle.textContent = translations[currentLanguage].about.title;
        const aboutParagraphs = document.querySelectorAll('.about-content p');
        const aboutContent = translations[currentLanguage].about.content;
        aboutParagraphs.forEach((p, index) => {
            if (index < aboutContent.length) {
                p.textContent = aboutContent[index];
            } else if (index === aboutContent.length) {
                p.textContent = translations[currentLanguage].about.skills;
            }
        });
    }

    // Update works page
    const worksTitle = document.querySelector('.works h2');
    if (worksTitle) {
        worksTitle.textContent = translations[currentLanguage].works.title;
        const worksSubtitle = document.querySelector('.works p');
        if (worksSubtitle) {
            worksSubtitle.textContent = translations[currentLanguage].works.subtitle;
        }
        const projectCards = document.querySelectorAll('.project-card');
        const projects = translations[currentLanguage].works.projects;
        projectCards.forEach((card, index) => {
            if (index < projects.length) {
                card.querySelector('.project-title').textContent = projects[index].title;
                card.querySelector('.project-tagline').textContent = projects[index].tagline;
            }
        });
    }

    // Update writing page
    const writingTitle = document.querySelector('.about h2');
    if (writingTitle && writingTitle.textContent === 'Writing') {
        writingTitle.textContent = translations[currentLanguage].writing.title;
        const writingSubtitle = document.querySelector('.about p');
        if (writingSubtitle) {
            writingSubtitle.textContent = translations[currentLanguage].writing.subtitle;
        }
        const articles = document.querySelectorAll('.fade-in-up');
        const writingArticles = translations[currentLanguage].writing.articles;
        articles.forEach((article, index) => {
            if (index < writingArticles.length) {
                const title = article.querySelector('h3');
                const date = article.querySelector('p:nth-child(2)');
                const content = article.querySelector('p:nth-child(3)');
                const readMore = article.querySelector('.read-more');
                if (title) title.textContent = writingArticles[index].title;
                if (date) date.textContent = writingArticles[index].date;
                if (content) content.textContent = writingArticles[index].content;
                if (readMore) readMore.textContent = translations[currentLanguage].writing.readMore;
            }
        });
    }

    // Update project detail page
    const projectTitle = document.querySelector('.project-detail h1');
    if (projectTitle) {
        projectTitle.textContent = translations[currentLanguage].project.title;
        const projectSubtitle = document.querySelector('.project-detail p');
        if (projectSubtitle) {
            projectSubtitle.textContent = translations[currentLanguage].project.subtitle;
        }
        const projectSections = document.querySelectorAll('.project-section');
        if (projectSections.length === 5) {
            // Overview section
            projectSections[0].querySelector('h2').textContent = translations[currentLanguage].project.sections.overview;
            const overviewParagraphs = projectSections[0].querySelectorAll('p');
            overviewParagraphs.forEach((p, index) => {
                if (index < translations[currentLanguage].project.sections.overviewContent.length) {
                    p.textContent = translations[currentLanguage].project.sections.overviewContent[index];
                }
            });
            // Design Process section
            projectSections[1].querySelector('h2').textContent = translations[currentLanguage].project.sections.designProcess;
            const designProcessParagraphs = projectSections[1].querySelectorAll('p');
            designProcessParagraphs.forEach((p, index) => {
                if (index < translations[currentLanguage].project.sections.designProcessContent.length) {
                    p.textContent = translations[currentLanguage].project.sections.designProcessContent[index];
                }
            });
            // Features section
            projectSections[2].querySelector('h2').textContent = translations[currentLanguage].project.sections.features;
            const featuresParagraphs = projectSections[2].querySelectorAll('p');
            if (featuresParagraphs.length > 0) {
                featuresParagraphs[0].textContent = translations[currentLanguage].project.sections.featuresContent;
            }
            const featuresList = projectSections[2].querySelector('ul');
            if (featuresList) {
                const featuresItems = featuresList.querySelectorAll('li');
                featuresItems.forEach((item, index) => {
                    if (index < translations[currentLanguage].project.sections.featuresList.length) {
                        item.textContent = translations[currentLanguage].project.sections.featuresList[index];
                    }
                });
            }
            // Technology section
            projectSections[3].querySelector('h2').textContent = translations[currentLanguage].project.sections.technology;
            const technologyParagraphs = projectSections[3].querySelectorAll('p');
            if (technologyParagraphs.length > 0) {
                technologyParagraphs[0].textContent = translations[currentLanguage].project.sections.technologyContent;
                if (technologyParagraphs.length > 1) {
                    technologyParagraphs[1].textContent = translations[currentLanguage].project.sections.technologyDetails;
                }
            }
            // Results section
            projectSections[4].querySelector('h2').textContent = translations[currentLanguage].project.sections.results;
            const resultsParagraphs = projectSections[4].querySelectorAll('p');
            resultsParagraphs.forEach((p, index) => {
                if (index < translations[currentLanguage].project.sections.resultsContent.length) {
                    p.textContent = translations[currentLanguage].project.sections.resultsContent[index];
                }
            });
            const resultsList = projectSections[4].querySelector('ul');
            if (resultsList) {
                const resultsItems = resultsList.querySelectorAll('li');
                resultsItems.forEach((item, index) => {
                    if (index < translations[currentLanguage].project.sections.resultsList.length) {
                        item.textContent = translations[currentLanguage].project.sections.resultsList[index];
                    }
                });
            }
        }
    }

    // Update footer
    const footerCopyright = document.querySelector('.footer-copyright');
    if (footerCopyright) {
        footerCopyright.textContent = translations[currentLanguage].footer.copyright;
    }
}

// Toggle Theme
function toggleTheme() {
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Enable Dark Mode
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    isDarkMode = true;
    localStorage.setItem('theme', 'dark');
}

// Disable Dark Mode
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    isDarkMode = false;
    localStorage.setItem('theme', 'light');
}

// Card Tilt Effect
function initCardTilt() {
    const cards = [...entryCards, ...projectCards];
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-8px) scale(1.02)';
        });
    });
}

// Ripple Effect
function initRippleEffect() {
    const cards = [...entryCards, ...projectCards];
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    projectSections.forEach(section => {
        observer.observe(section);
    });
}

// Page Load Animation
function initPageLoadAnimation() {
    document.addEventListener('DOMContentLoaded', () => {
        // Add fade-in animation to hero elements
        const heroElements = document.querySelectorAll('.hero-title, .hero-tagline');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });
        
        // Add fade-in animation to entry cards
        entryCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, 600 + (index * 200));
        });
    });
}

// Entry Card Navigation
function initEntryCardNavigation() {
    entryCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardTitle = card.querySelector('h3').textContent;
            let targetUrl = '';
            
            switch (cardTitle) {
                case 'About':
                    targetUrl = 'about.html';
                    break;
                case 'Works':
                    targetUrl = 'works.html';
                    break;
                case 'Writing':
                    targetUrl = 'writing.html';
                    break;
                default:
                    targetUrl = '#';
            }
            
            if (targetUrl) {
                window.location.href = targetUrl;
            }
        });
    });
}

// Project Card Navigation
function initProjectCardNavigation() {
    projectCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            window.location.href = `project.html?id=${index + 1}`;
        });
    });
}

// 头像上传功能
function initAvatarUpload() {
    const portraits = document.querySelectorAll('.portrait');
    portraits.forEach(portrait => {
        portrait.addEventListener('click', () => {
            // 创建隐藏的文件输入
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            // 点击文件输入
            fileInput.click();

            // 处理文件上传
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        // 更新头像显示
                        portrait.style.backgroundImage = `url(${event.target.result})`;
                        // 保存到localStorage
                        localStorage.setItem('avatar', event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
                // 移除文件输入
                document.body.removeChild(fileInput);
            });
        });

        // 加载保存的头像
        const savedAvatar = localStorage.getItem('avatar');
        if (savedAvatar) {
            portrait.style.backgroundImage = `url(${savedAvatar})`;
        } else {
            // 使用本地默认头像
            portrait.style.backgroundImage = `url(images/avatar/avatar.jpg)`;
        }
    });
}

// Initialize all functions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Additional Initialization for specific pages
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', initEntryCardNavigation);
}

if (window.location.pathname.includes('works.html')) {
    document.addEventListener('DOMContentLoaded', initProjectCardNavigation);
}

// Edit Mode Functionality
let isEditMode = false;

// Initialize Edit Mode
function initEditMode() {
    // Add edit mode toggle button
    addEditModeToggle();
    
    // Load saved content from localStorage
    loadSavedContent();
}

// Add Edit Mode Toggle Button
function addEditModeToggle() {
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
        const editModeToggle = document.createElement('div');
        editModeToggle.className = 'edit-mode-toggle';
        editModeToggle.innerHTML = '<span>编辑模式</span>';
        editModeToggle.style.cssText = `
            position: relative;
            display: inline-block;
            margin-left: 1rem;
            cursor: pointer;
        `;
        
        const toggleSwitch = document.createElement('div');
        toggleSwitch.className = 'toggle-switch';
        toggleSwitch.style.cssText = `
            position: relative;
            width: 50px;
            height: 24px;
            background-color: #ccc;
            border-radius: 12px;
            transition: background-color 0.3s;
        `;
        
        const toggleKnob = document.createElement('div');
        toggleKnob.className = 'toggle-knob';
        toggleKnob.style.cssText = `
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
        `;
        
        toggleSwitch.appendChild(toggleKnob);
        editModeToggle.appendChild(toggleSwitch);
        
        // Insert after theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            headerContainer.insertBefore(editModeToggle, themeToggle.nextSibling);
        }
        
        // Add click event
        editModeToggle.addEventListener('click', () => {
            isEditMode = !isEditMode;
            toggleEditMode();
        });
    }
}

// Toggle Edit Mode
function toggleEditMode() {
    const toggleSwitch = document.querySelector('.toggle-switch');
    const toggleKnob = document.querySelector('.toggle-knob');
    
    if (isEditMode) {
        // Enable edit mode
        toggleSwitch.style.backgroundColor = '#0071e3';
        toggleKnob.style.transform = 'translateX(26px)';
        enableEditMode();
    } else {
        // Disable edit mode
        toggleSwitch.style.backgroundColor = '#ccc';
        toggleKnob.style.transform = 'translateX(2px)';
        disableEditMode();
    }
}

// Enable Edit Mode
function enableEditMode() {
    // Make hero title editable
    makeHeroTitleEditable();
    
    // Make hero tagline editable
    makeHeroTaglineEditable();
    
    // Make logo editable
    makeLogoEditable();
    
    // Make about content editable
    makeAboutContentEditable();
    
    // Add background image upload functionality
    addBackgroundImageUpload();
}

// Disable Edit Mode
function disableEditMode() {
    // Revert editable elements to regular text
    revertEditableElements();
}

// Make Hero Title Editable
function makeHeroTitleEditable() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const currentText = heroTitle.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.cssText = `
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
            background: transparent;
            border: 1px solid #0071e3;
            border-radius: 4px;
            padding: 0.5rem;
            width: 100%;
            max-width: 300px;
        `;
        
        input.addEventListener('blur', () => {
            heroTitle.textContent = input.value;
            heroTitle.style.display = 'block';
            input.remove();
            // Save to localStorage
            localStorage.setItem('heroTitle', input.value);
        });
        
        heroTitle.style.display = 'none';
        heroTitle.parentNode.insertBefore(input, heroTitle);
        input.focus();
    }
}

// Make Hero Tagline Editable
function makeHeroTaglineEditable() {
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        const currentText = heroTagline.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.cssText = `
            font-size: inherit;
            color: inherit;
            background: transparent;
            border: 1px solid #0071e3;
            border-radius: 4px;
            padding: 0.5rem;
            width: 100%;
            max-width: 300px;
        `;
        
        input.addEventListener('blur', () => {
            heroTagline.textContent = input.value;
            heroTagline.style.display = 'block';
            input.remove();
            // Save to localStorage
            localStorage.setItem('heroTagline', input.value);
        });
        
        heroTagline.style.display = 'none';
        heroTagline.parentNode.insertBefore(input, heroTagline);
        input.focus();
    }
}

// Make Logo Editable
function makeLogoEditable() {
    const logo = document.querySelector('.logo');
    if (logo) {
        const currentText = logo.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.cssText = `
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
            background: transparent;
            border: 1px solid #0071e3;
            border-radius: 4px;
            padding: 0.5rem;
            width: 100%;
            max-width: 150px;
        `;
        
        input.addEventListener('blur', () => {
            logo.textContent = input.value;
            logo.style.display = 'block';
            input.remove();
            // Save to localStorage
            localStorage.setItem('logoText', input.value);
        });
        
        logo.style.display = 'none';
        logo.parentNode.insertBefore(input, logo);
        input.focus();
    }
}

// Make About Content Editable
function makeAboutContentEditable() {
    const aboutParagraphs = document.querySelectorAll('.about-content p');
    aboutParagraphs.forEach((p, index) => {
        const currentText = p.textContent;
        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        textarea.style.cssText = `
            font-size: inherit;
            color: inherit;
            background: transparent;
            border: 1px solid #0071e3;
            border-radius: 4px;
            padding: 0.5rem;
            width: 100%;
            min-height: 100px;
            resize: vertical;
        `;
        
        textarea.addEventListener('blur', () => {
            p.textContent = textarea.value;
            p.style.display = 'block';
            textarea.remove();
            // Save to localStorage
            const aboutContent = JSON.parse(localStorage.getItem('aboutContent') || '{}');
            aboutContent[index] = textarea.value;
            localStorage.setItem('aboutContent', JSON.stringify(aboutContent));
        });
        
        p.style.display = 'none';
        p.parentNode.insertBefore(textarea, p);
        textarea.focus();
    });
}

// Add Background Image Upload
function addBackgroundImageUpload() {
    const body = document.body;
    const uploadButton = document.createElement('button');
    uploadButton.className = 'bg-upload-btn';
    uploadButton.textContent = '上传背景图';
    uploadButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 0.75rem 1.5rem;
        background-color: #0071e3;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        z-index: 1000;
    `;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // Update background image
                const backgroundLayers = document.querySelectorAll('.background-layer');
                if (backgroundLayers.length > 0) {
                    backgroundLayers[0].style.backgroundImage = `url(${event.target.result})`;
                }
                // Save to localStorage
                localStorage.setItem('backgroundImage', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    body.appendChild(uploadButton);
    body.appendChild(fileInput);
}

// Revert Editable Elements
function revertEditableElements() {
    // Remove any remaining input/textarea elements
    const editableInputs = document.querySelectorAll('.hero-title + input, .hero-tagline + input, .logo + input, .about-content textarea');
    editableInputs.forEach(input => {
        input.remove();
    });
    
    // Show original elements
    const heroTitle = document.querySelector('.hero-title');
    const heroTagline = document.querySelector('.hero-tagline');
    const logo = document.querySelector('.logo');
    const aboutParagraphs = document.querySelectorAll('.about-content p');
    
    if (heroTitle) heroTitle.style.display = 'block';
    if (heroTagline) heroTagline.style.display = 'block';
    if (logo) logo.style.display = 'block';
    aboutParagraphs.forEach(p => p.style.display = 'block');
    
    // Remove background upload button
    const bgUploadBtn = document.querySelector('.bg-upload-btn');
    if (bgUploadBtn) bgUploadBtn.remove();
    
    const fileInput = document.querySelector('input[type="file"][accept="image/*"]');
    if (fileInput && fileInput.style.display === 'none') {
        fileInput.remove();
    }
}

// Load Saved Content from localStorage
function loadSavedContent() {
    // Load hero title
    const savedHeroTitle = localStorage.getItem('heroTitle');
    if (savedHeroTitle) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = savedHeroTitle;
        }
    }
    
    // Load hero tagline
    const savedHeroTagline = localStorage.getItem('heroTagline');
    if (savedHeroTagline) {
        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline) {
            heroTagline.textContent = savedHeroTagline;
        }
    }
    
    // Load logo text
    const savedLogoText = localStorage.getItem('logoText');
    if (savedLogoText) {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.textContent = savedLogoText;
        }
    }
    
    // Load about content
    const savedAboutContent = localStorage.getItem('aboutContent');
    if (savedAboutContent) {
        const aboutContent = JSON.parse(savedAboutContent);
        const aboutParagraphs = document.querySelectorAll('.about-content p');
        aboutParagraphs.forEach((p, index) => {
            if (aboutContent[index]) {
                p.textContent = aboutContent[index];
            }
        });
    }
    
    // Load background image
    const savedBackgroundImage = localStorage.getItem('backgroundImage');
    if (savedBackgroundImage) {
        const backgroundLayers = document.querySelectorAll('.background-layer');
        if (backgroundLayers.length > 0) {
            backgroundLayers[0].style.backgroundImage = `url(${savedBackgroundImage})`;
        }
    }
}
