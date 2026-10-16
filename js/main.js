/**
 * 豐川葡萄 FENG CHUAN GRAPE 官方網站互動腳本
 * 功能模組：
 * 1. 深色模式切換 (Dark Mode Toggle with LocalStorage & OS Preference)
 * 2. 行動版漢堡選單抽屜 (Mobile Drawer Navigation)
 * 3. 滾動偵測、導覽列狀態與回到頂部 (Scroll Spy, Sticky Nav & Back to Top)
 * 4. 常見問題手風琴 (FAQ Accordion with Accessibility)
 * 5. 禮盒產品分類篩選 (Product Category Filter)
 * 6. 產品詳細彈窗 (Quick View Product Modal)
 * 7. 客製洽詢表單即時驗證與提交回饋 (Form Validation & Toast Notification)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. 深色模式切換 (Dark Mode Toggle)
  // ==========================================================================
  const initTheme = () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const htmlEl = document.documentElement;
    const STORAGE_KEY = 'fc_theme_preference';

    // 取得儲存偏好或系統設定
    const getPreferredTheme = () => {
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // 套用主題
    const applyTheme = (theme) => {
      htmlEl.setAttribute('data-theme', theme);
      if (themeToggleBtn) {
        const isDark = theme === 'dark';
        themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        themeToggleBtn.setAttribute('title', isDark ? '切換為淺色模式' : '切換為深色模式');
        themeToggleBtn.setAttribute('aria-label', isDark ? '切換為淺色模式' : '切換為深色模式');
      }
    };

    // 初始化設定
    applyTheme(getPreferredTheme());

    // 點擊切換事件
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
        showToast(newTheme === 'dark' ? '已切換為深色模式 🌙' : '已切換為淺色模式 ☀️', 'info');
      });
    }

    // 監聽作業系統偏好變更 (若使用者尚未手動覆寫)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  // ==========================================================================
  // 2. 行動版漢堡選單抽屜 (Mobile Drawer Navigation)
  // ==========================================================================
  const initMobileMenu = () => {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

    if (!mobileMenuToggle || !mobileDrawer || !drawerOverlay) return;

    const openDrawer = () => {
      mobileDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
      mobileMenuToggle.classList.add('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      drawerOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // 防止背景滾動
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      drawerOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    drawerOverlay.addEventListener('click', closeDrawer);

    // 點擊任意選單連結後自動關閉抽屜
    drawerLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    // 按 Esc 鍵關閉
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  };

  // ==========================================================================
  // 3. 滾動偵測、Sticky 導覽列與回到頂部按鈕 (Scroll Effects & Back to Top)
  // ==========================================================================
  const initScrollEffects = () => {
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // 導覽列陰影與縮小效果
      if (header) {
        if (scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // 回到頂部按鈕顯示/隱藏
      if (backToTopBtn) {
        if (scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      // 導覽列當前區塊高亮 (Scroll Spy)
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 回到頂部點擊事件
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ==========================================================================
  // 4. 常見問題手風琴 (FAQ Accordion with Accessibility)
  // ==========================================================================
  const initAccordion = () => {
    const accordion = document.getElementById('faqAccordion');
    if (!accordion) return;

    const items = accordion.querySelectorAll('.accordion-item');

    // 初始化第一個開展項目的 max-height
    items.forEach((item) => {
      const panel = item.querySelector('.accordion-panel');
      if (item.classList.contains('active') && panel) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });

    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');

      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // 收合其他所有手風琴項目 (保持單一展開)
        items.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.accordion-trigger');
            const otherPanel = otherItem.querySelector('.accordion-panel');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        // 切換目前項目
        if (isActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  };

  // ==========================================================================
  // 5. 禮盒產品分類篩選 (Product Category Filter)
  // ==========================================================================
  const initProductFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length === 0 || productCards.length === 0) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetCategory = btn.getAttribute('data-filter');

        // 更新按鈕狀態
        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // 篩選卡片
        productCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (targetCategory === 'all' || cardCategory === targetCategory) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  };

  // ==========================================================================
  // 6. 產品詳細彈窗模態框 (Product Details Quick View Modal)
  // ==========================================================================
  // 產品資料庫
  const productData = {
    p1: {
      title: '經典御品巨峰葡萄禮盒',
      category: '招牌特選',
      badge: '熱銷首選 · 黑珍珠級',
      image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
      specs: '雙串特等裝 (每串約 600g，總重約 1.2kg ± 5%)',
      price: 'NT$ 1,380',
      brix: '18°Bx ~ 19.5°Bx',
      desc: '產自彰化大村的核心葡萄產區，以純淨山泉水灌溉並採減法友善農耕。每顆果實深紫近黑、果霜飽滿均勻，入口果汁四溢、酸甜交融，是逢年過節最受商務與長輩青睞的經典之作。',
      features: [
        '彰化大村產地履歷契作果園',
        '近紅外線光波全檢糖度保證 18 度以上',
        '日本進口防震木盒，含手作緞帶與保鮮內襯',
        '最佳賞味期：冷藏可保存 7-10 天'
      ]
    },
    p2: {
      title: '極光翡翠麝香葡萄禮盒',
      category: '精品珍稀',
      badge: '限定限量 · 尊榮奢華',
      image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80',
      specs: '單串頂級大果裝 (約 750g ± 5%)',
      price: 'NT$ 1,980',
      brix: '20°Bx 以上極致甜度',
      desc: '宛如璀璨翡翠的晶透果肉，表皮極薄且無籽，洗淨即可連皮整顆食用。咀嚼時散發獨特的淡雅玫瑰荔枝香氣，口感緊實清脆，帶來令人回味無窮的奢華品嚐體驗。',
      features: [
        '單房重達 750g 特等巨果嚴格梳果篩選',
        '皮薄肉脆無籽，天然玫瑰果香綻放',
        '精品珠寶盒級包裝，附專屬品鑑小卡與冰袋',
        '產季限量預購，極致送禮體現無上品味'
      ]
    },
    p3: {
      title: '豐川雙饗綜合果物禮盒',
      category: '綜合時令',
      badge: '吉慶圓滿 · 當季名品',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      specs: '巨峰葡萄 1 房 + 特選鮮果 2 入 (依季節搭配)',
      price: 'NT$ 1,680',
      brix: '多層次鮮甜風味',
      desc: '薈萃當季最令人心動的頂級鮮果。以豐川招牌巨峰葡萄為主角，搭配日本青森蜜富士蘋果或台灣在地水梨，色彩豐盛耀眼，寓意「事事平安、年年豐收」，最適合家庭送禮與企業員工賀禮。',
      features: [
        '當令雙重果物豐富組合，老少皆宜',
        '手工客製雙格獨立抗壓避震結構',
        '每盒附贈品牌專屬質感提袋',
        '企業採購可享客製化組合彈性調整'
      ]
    },
    p4: {
      title: '尊榮企業定制禮盒',
      category: '企業專案',
      badge: '商務專屬 · 專案規劃',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      specs: '依企業贈禮需求、盒數與預算量身配置',
      price: '依專案客製報價',
      brix: '最高標準果品品質把關',
      desc: '專為企業 VIP 客戶、年節饋贈或重大活動打造。由豐川專業設計團隊協助印製企業燙金 Logo 腰封、設計手寫問候卡，並支援多點冷鏈直送到府，是提升品牌形象與溫度的強大助力。',
      features: [
        '免費提供企業 Logo 燙金腰封與專版謝卡印製',
        '支援全國多點指定收件地址分拆配送與追蹤',
        '滿額享企業專屬採購折扣與開立統一發票',
        '專屬禮賓顧問一對一服務，確保送禮全程零疏漏'
      ]
    }
  };

  const initProductModal = () => {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn, .view-detail-btn, .footer-product-link');

    if (!modal || !modalContent) return;

    const openModal = (productId) => {
      const data = productData[productId];
      if (!data) return;

      const featureListHtml = data.features.map(f => `<li>${f}</li>`).join('');

      modalContent.innerHTML = `
        <div class="modal-product-layout">
          <div class="modal-product-img-box">
            <img src="${data.image}" alt="${data.title}" class="modal-product-img">
          </div>
          <div class="modal-product-info">
            <span class="modal-product-badge">${data.badge}</span>
            <h3 class="modal-product-title" id="modalTitle">${data.title}</h3>
            <p class="modal-product-desc">${data.desc}</p>
            <ul class="modal-feature-list">
              <li><strong>規格容量：</strong>${data.specs}</li>
              <li><strong>甜度指標：</strong>${data.brix}</li>
              ${featureListHtml}
            </ul>
            <div class="modal-price-row">
              <div class="product-price">
                <span class="price-value">${data.price}</span>
              </div>
              <a href="#contact" class="btn btn-primary modal-inquire-btn" data-product-title="${data.title}">
                洽詢此款禮盒
              </a>
            </div>
          </div>
        </div>
      `;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // 監聽彈窗內部的洽詢按鈕
      const inquireBtn = modalContent.querySelector('.modal-inquire-btn');
      if (inquireBtn) {
        inquireBtn.addEventListener('click', () => {
          closeModal();
          prefillContactForm(data.title);
        });
      }
    };

    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    quickViewButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pid = btn.getAttribute('data-product');
        if (pid) openModal(pid);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // 產品卡片上的「立即洽詢」按鈕連動預填
    const orderInquireBtns = document.querySelectorAll('.order-inquire-btn');
    orderInquireBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.getAttribute('data-item');
        if (item) prefillContactForm(item);
      });
    });
  };

  // 預填表單禮盒選單
  const prefillContactForm = (productTitle) => {
    const targetProductSelect = document.getElementById('targetProduct');
    if (targetProductSelect) {
      for (let i = 0; i < targetProductSelect.options.length; i++) {
        if (targetProductSelect.options[i].value === productTitle) {
          targetProductSelect.selectedIndex = i;
          break;
        }
      }
    }
  };

  // ==========================================================================
  // 7. 客製洽詢表單驗證與回饋 (Form Validation & Interactive Feedback)
  // ==========================================================================
  const initFormValidation = () => {
    const form = document.getElementById('inquiryForm');
    const submitBtn = document.getElementById('submitBtn');

    if (!form || !submitBtn) return;

    // 驗證規則定義
    const validators = {
      userName: (val) => {
        if (!val.trim()) return '請填寫您的姓名';
        if (val.trim().length < 2) return '姓名至少需 2 個字元';
        return '';
      },
      userPhone: (val) => {
        if (!val.trim()) return '請填寫聯絡電話';
        const phoneRegex = /^(\+?886\-?|0)9\d{8}$|^(\+?886\-?|0)\d{1,2}\-?\d{6,8}$/;
        if (!phoneRegex.test(val.replace(/[\s-]/g, ''))) {
          return '請輸入有效的台灣電話或手機號碼 (例如 0912-345-678)';
        }
        return '';
      },
      userEmail: (val) => {
        if (!val.trim()) return '請填寫電子郵件';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) {
          return '請輸入正確的電子郵件格式';
        }
        return '';
      },
      giftPurpose: (val) => {
        if (!val) return '請選擇送禮用途情境';
        return '';
      },
      giftQuantity: (val) => {
        if (!val) return '請選擇預計需求數量';
        return '';
      },
      agreePrivacy: (checked) => {
        if (!checked) return '請勾選並同意隱私權保護政策';
        return '';
      }
    };

    // 驗證單一欄位
    const validateField = (fieldName) => {
      const field = form.elements[fieldName];
      const errorEl = document.getElementById(`${fieldName}Error`);
      if (!field || !errorEl) return true;

      let errorMsg = '';
      if (field.type === 'checkbox') {
        errorMsg = validators[fieldName] ? validators[fieldName](field.checked) : '';
      } else {
        errorMsg = validators[fieldName] ? validators[fieldName](field.value) : '';
      }

      if (errorMsg) {
        field.classList.add('is-invalid');
        errorEl.textContent = errorMsg;
        return false;
      } else {
        field.classList.remove('is-invalid');
        errorEl.textContent = '';
        return true;
      }
    };

    // 綁定輸入時即時消除錯誤
    ['userName', 'userPhone', 'userEmail', 'giftPurpose', 'giftQuantity'].forEach((name) => {
      const el = form.elements[name];
      if (el) {
        el.addEventListener('input', () => validateField(name));
        el.addEventListener('blur', () => validateField(name));
      }
    });

    const privacyEl = form.elements['agreePrivacy'];
    if (privacyEl) {
      privacyEl.addEventListener('change', () => validateField('agreePrivacy'));
    }

    // 表單送出處理
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      const requiredFields = ['userName', 'userPhone', 'userEmail', 'giftPurpose', 'giftQuantity', 'agreePrivacy'];

      requiredFields.forEach((fieldName) => {
        const isValid = validateField(fieldName);
        if (!isValid) isFormValid = false;
      });

      if (!isFormValid) {
        showToast('請完整填寫必填欄位後再行送出。', 'error');
        // 聚焦至第一個錯誤欄位
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // 進入模擬發送狀態
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      const userName = form.elements['userName'].value;
      const targetProduct = form.elements['targetProduct'].value;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // 成功提示
        showToast(`感謝 ${userName} 先生/女士！我們已收到您的「${targetProduct}」洽詢需求，禮賓顧問將於 1 個工作日內與您聯絡。`, 'success', 6000);

        // 重置表單
        form.reset();

        // 清理所有驗證樣式
        requiredFields.forEach((name) => {
          const field = form.elements[name];
          const errorEl = document.getElementById(`${name}Error`);
          if (field) field.classList.remove('is-invalid');
          if (errorEl) errorEl.textContent = '';
        });
      }, 1200);
    });
  };

  // ==========================================================================
  // 8. 吐司通知提示系統 (Toast Notification Utility)
  // ==========================================================================
  window.showToast = (message, type = 'info', duration = 3500) => {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconText = '🍇';
    if (type === 'success') iconText = '✓';
    if (type === 'error') iconText = '⚠️';
    if (type === 'info') iconText = 'ℹ️';

    toast.innerHTML = `
      <span class="toast-icon">${iconText}</span>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // 動畫滑入
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // 定時自動關閉
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      });
    }, duration);
  };

  // ==========================================================================
  // 初始化所有模組
  // ==========================================================================
  initTheme();
  initMobileMenu();
  initScrollEffects();
  initAccordion();
  initProductFilters();
  initProductModal();
  initFormValidation();

  console.log('🍇 豐川葡萄官方網站腳本載入完成。好果成禮，心意豐盛。');
});
