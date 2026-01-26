# Shopify テーマ開発 - 注意事項

## ⚠️ 重要：管理画面の設定を上書きしないために

### 問題

`shopify theme push` を実行すると、**ローカルの古い設定ファイルが管理画面の最新設定を上書き**してしまう可能性があります。

特に `config/settings_data.json` には以下の重要な情報が含まれています：
- セクションの配置・設定
- テーマカラー・フォント設定
- 商品コレクションの表示設定
- その他すべての管理画面で行った変更

### 解決策

#### 方法1: Push前に必ず最新状態を取得

```bash
# 管理画面の最新状態を取得
git pull origin main

# その後にpush
shopify theme push --theme <THEME_ID> --allow-live
```

#### 方法2: 特定のファイルだけをpush（推奨）

```bash
# 新しいファイルやアセットだけをpush
shopify theme push --theme <THEME_ID> \
  --only sections/popup.liquid \
  --only assets/popup.js \
  --only assets/section-popup.css \
  --allow-live
```

#### 方法3: 設定ファイルを除外してpush

```bash
# config/settings_data.jsonを除外してpush
shopify theme push --theme <THEME_ID> \
  --ignore config/settings_data.json \
  --allow-live
```

## 📋 推奨ワークフロー

### 新機能追加時

1. **最新状態を取得**
   ```bash
   git pull origin main
   ```

2. **ローカルで開発・テスト**
   - セクション、アセット、スニペットを作成・編集

3. **特定ファイルのみpush**
   ```bash
   shopify theme push --theme <THEME_ID> \
     --only sections/new-section.liquid \
     --only assets/new-style.css \
     --only assets/new-script.js \
     --allow-live
   ```

4. **管理画面で確認**
   - テーマエディターで動作確認
   - 必要な設定を管理画面で調整

5. **管理画面の変更をpull**
   ```bash
   git pull origin main
   ```

### 管理画面で設定変更した後

1. **必ず変更をpull**
   ```bash
   git pull origin main
   ```

2. **コミット（自動で作成される）**
   - Shopifyが自動的にコミットを作成
   - "Update from Shopify for theme shopify-prototype/main"

## 🔧 よく使うコマンド

### テーマIDの確認
```bash
shopify theme list
```

### 最新状態のダウンロード
```bash
# 全ファイル
shopify theme pull --theme <THEME_ID>

# 特定ファイルのみ
shopify theme pull --theme <THEME_ID> --only config/settings_data.json
```

### 現在のテーマID
```
shopify-prototype/main: #148983447726
```

## 🚨 もし上書きしてしまったら

### 管理画面の設定を復元する方法

1. **最新のコミットに戻す**
   ```bash
   git fetch origin
   git reset --hard origin/main
   ```

2. **設定ファイルを再度push**
   ```bash
   shopify theme push --theme <THEME_ID> \
     --only config/settings_data.json \
     --allow-live
   ```

3. **追加したファイルを再度push**
   ```bash
   shopify theme push --theme <THEME_ID> \
     --only <新規追加したファイル> \
     --allow-live
   ```

## 📝 Git管理のベストプラクティス

### 避けるべきこと
- ❌ `git pull` せずに `shopify theme push`
- ❌ 全ファイルを一括push
- ❌ `config/settings_data.json` をローカルで直接編集

### 推奨すること
- ✅ Push前に必ず `git pull origin main`
- ✅ `--only` オプションで特定ファイルのみpush
- ✅ 管理画面での変更後は必ずpull
- ✅ 開発用に別ブランチ/テーマを使用

## 🗂️ ファイルの扱い方

### 管理画面で編集すべきファイル
- `config/settings_data.json` - テーマ設定
- `templates/*.json` - ページテンプレート設定

### ローカルで編集すべきファイル
- `sections/*.liquid` - セクションコード
- `snippets/*.liquid` - スニペット
- `assets/*.css` - スタイルシート
- `assets/*.js` - JavaScript
- `locales/*.json` - 翻訳ファイル（ただし管理画面で編集されることもある）

## 🔄 定期的なメンテナンス

### 毎日の開発開始時
```bash
git pull origin main
```

### 管理画面で変更後
```bash
git pull origin main
git log -1  # 最新のコミットを確認
```

## 📚 参考リンク

- [Shopify CLI Theme Commands](https://shopify.dev/docs/themes/tools/cli/commands)
- [Theme Development Workflow](https://shopify.dev/docs/themes/tools/cli/theme-commands)

---

**最終更新**: 2026-01-26
**作成者**: Claude Code
