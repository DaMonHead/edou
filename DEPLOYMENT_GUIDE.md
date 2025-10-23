# 🌐 如何線上分享 SEN 篩查系統

## 方法一：GitHub Pages（推薦 - 免費）

### 步驟 1：準備 GitHub 帳號
1. 前往 [GitHub.com](https://github.com) 註冊帳號
2. 如果已有帳號，直接登入

### 步驟 2：上傳程式碼到 GitHub
1. 在 GitHub 上建立新 repository，命名為 `sen-screening-app`
2. 選擇 "Public" 讓其他人可以訪問
3. 不要勾選 "Add a README file"

### 步驟 3：上傳檔案
```bash
# 在終端機中執行以下指令
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
git add .
git commit -m "Initial commit: SEN screening app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sen-screening-app.git
git push -u origin main
```

### 步驟 4：啟用 GitHub Pages
1. 進入 repository 的 Settings
2. 滾動到 "Pages" 部分
3. 在 "Source" 選擇 "Deploy from a branch"
4. 選擇 "main" branch 和 "/ (root)" 資料夾
5. 點擊 "Save"
6. 等待幾分鐘，你的網站將在 `https://YOUR-USERNAME.github.io/sen-screening-app` 上線

---

## 方法二：Netlify（最簡單）

### 步驟 1：準備檔案
1. 將所有檔案壓縮成 ZIP 檔案
2. 檔案包括：`index.html`, `styles.css`, `script.js`, `README.md`

### 步驟 2：部署到 Netlify
1. 前往 [Netlify.com](https://netlify.com)
2. 註冊/登入帳號
3. 點擊 "Add new site" → "Deploy manually"
4. 拖拽 ZIP 檔案到上傳區域
5. 等待部署完成
6. 獲得一個免費的網址，例如：`https://amazing-name-123456.netlify.app`

### 步驟 3：自訂網址（可選）
1. 在 Netlify 控制台可以更改網站名稱
2. 也可以連接自己的網域

---

## 方法三：Vercel（快速部署）

### 步驟 1：準備 GitHub Repository
1. 先按照方法一將程式碼上傳到 GitHub

### 步驟 2：連接 Vercel
1. 前往 [Vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入
3. 點擊 "New Project"
4. 選擇你的 `sen-screening-app` repository
5. 點擊 "Deploy"
6. 幾分鐘後獲得網址，例如：`https://sen-screening-app.vercel.app`

---

## 方法四：直接分享檔案

### 使用雲端儲存
1. **Google Drive**：
   - 上傳所有檔案到 Google Drive
   - 設定分享權限為 "Anyone with the link can view"
   - 分享 `index.html` 的連結

2. **Dropbox**：
   - 上傳檔案到 Dropbox
   - 右鍵點擊 `index.html` → "Share" → "Copy link"
   - 將連結中的 `?dl=0` 改為 `?dl=1` 讓檔案可以直接開啟

3. **OneDrive**：
   - 上傳檔案到 OneDrive
   - 右鍵點擊 `index.html` → "Share" → "Copy link"

---

## 方法五：本地伺服器（測試用）

### 使用 Python（如果已安裝）
```bash
# 在 SEN 資料夾中執行
python3 -m http.server 8000
```
然後在瀏覽器開啟 `http://localhost:8000`

### 使用 Node.js（如果已安裝）
```bash
# 安裝 http-server
npm install -g http-server

# 在 SEN 資料夾中執行
http-server
```

---

## 🎯 推薦方案

### 最佳選擇：**Netlify**
- ✅ 最簡單快速
- ✅ 免費且穩定
- ✅ 自動 HTTPS
- ✅ 可以自訂網址

### 次佳選擇：**GitHub Pages**
- ✅ 完全免費
- ✅ 與程式碼管理整合
- ✅ 專業的網址格式

### 快速測試：**直接分享檔案**
- ✅ 最快速
- ✅ 不需要技術知識
- ⚠️ 功能可能受限

---

## 📱 分享給朋友

### 分享連結
```
嗨！我建立了一個中醫診所 SEN 兒童篩查系統，
請試用看看：https://your-app-url.com

功能包括：
- 兒童發展評估
- 風險等級分析
- 患者資料管理
- 統計報告

歡迎提供意見回饋！
```

### 使用說明
1. 點擊連結開啟系統
2. 點擊「篩查評估」開始測試
3. 填寫範例資料進行評估
4. 查看「患者管理」和「報告分析」功能

---

## 🔧 故障排除

### 常見問題
1. **網站無法開啟**：檢查網址是否正確
2. **功能不正常**：確認使用現代瀏覽器（Chrome、Firefox、Safari、Edge）
3. **資料遺失**：提醒朋友資料僅儲存在本地瀏覽器中

### 瀏覽器相容性
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

---

## 📞 技術支援

如果遇到問題，可以：
1. 檢查瀏覽器控制台是否有錯誤訊息
2. 確認所有檔案都已正確上傳
3. 嘗試清除瀏覽器快取
4. 使用不同的瀏覽器測試

祝您分享順利！🎉
