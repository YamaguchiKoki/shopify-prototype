class PopupManager {
  constructor(popupElement) {
    this.popup = popupElement;
    this.popupId = this.popup.dataset.popupId;
    this.showOnce = this.popup.dataset.showOnce === 'true';
    this.storageKey = `popup-shown-${this.popupId}`;
    this.closeButton = this.popup.querySelector('.popup-close');
    this.container = this.popup.querySelector('.popup-container');

    this.init();
  }

  init() {
    // Shopifyのデザインモード（管理画面のカスタマイザー）では常に表示しない
    if (window.Shopify && window.Shopify.designMode) {
      return;
    }

    // 初回表示のチェック
    if (this.shouldShow()) {
      this.show();
    }

    // イベントリスナーの設定
    this.setupEventListeners();
  }

  shouldShow() {
    if (!this.showOnce) {
      return true;
    }

    // localStorageで表示済みかチェック
    return !localStorage.getItem(this.storageKey);
  }

  show() {
    // セクション設定から遅延時間を取得（デフォルト1000ms）
    const delay = parseInt(this.popup.dataset.popupDelay) || 1000;

    setTimeout(() => {
      this.popup.classList.add('show');
      document.body.classList.add('popup-open');

      // アニメーション用に少し遅延
      requestAnimationFrame(() => {
        this.popup.classList.add('active');
      });

      // 表示済みフラグを保存
      if (this.showOnce) {
        localStorage.setItem(this.storageKey, 'true');
      }
    }, delay);
  }

  hide() {
    this.popup.classList.remove('active');

    setTimeout(() => {
      this.popup.classList.remove('show');
      document.body.classList.remove('popup-open');
    }, 300); // CSSのトランジション時間と合わせる
  }

  setupEventListeners() {
    // 閉じるボタン
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.hide());
    }

    // オーバーレイクリックで閉じる
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.hide();
      }
    });

    // Escapeキーで閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.popup.classList.contains('active')) {
        this.hide();
      }
    });

    // コンテナクリックの伝播を止める（オーバーレイクリックと区別）
    if (this.container) {
      this.container.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  // デバッグ用：表示状態をリセット
  reset() {
    localStorage.removeItem(this.storageKey);
    console.log(`Popup ${this.popupId} reset. Reload to see it again.`);
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  const popupElements = document.querySelectorAll('.popup-overlay');

  popupElements.forEach((popupElement) => {
    const popup = new PopupManager(popupElement);

    // デバッグ用：グローバルに参照を保存
    if (!window.popups) {
      window.popups = [];
    }
    window.popups.push(popup);
  });
});

// デバッグ用：全ポップアップをリセット
window.resetAllPopups = () => {
  if (window.popups) {
    window.popups.forEach(popup => popup.reset());
    console.log('All popups reset. Reload the page to see them again.');
  }
};
