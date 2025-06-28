class ColorMatchGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.highScore = this.loadHighScore();
        this.targetColor = { r: 0, g: 0, b: 0 };
        this.playerColor = { r: 128, g: 128, b: 128 };
        this.consecutiveSuccesses = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateNewTargetColor();
        this.updateDisplay();
    }
    
    initializeElements() {
        // DOM要素の取得
        this.elements = {
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            highScore: document.getElementById('high-score'),
            targetColor: document.getElementById('target-color'),
            playerColor: document.getElementById('player-color'),
            targetRgb: document.getElementById('target-rgb'),
            playerRgb: document.getElementById('player-rgb'),
            redSlider: document.getElementById('red-slider'),
            greenSlider: document.getElementById('green-slider'),
            blueSlider: document.getElementById('blue-slider'),
            redValue: document.getElementById('red-value'),
            greenValue: document.getElementById('green-value'),
            blueValue: document.getElementById('blue-value'),
            submitBtn: document.getElementById('submit-btn'),
            newGameBtn: document.getElementById('new-game-btn'),
            resultDisplay: document.getElementById('result-display'),
            accuracy: document.getElementById('accuracy'),
            pointsEarned: document.getElementById('points-earned')
        };
    }
    
    setupEventListeners() {
        // スライダーイベント（デバウンス処理でパフォーマンス向上）
        const debouncedUpdateColor = this.debounce(() => this.updatePlayerColor(), 16); // 60fps制限
        this.elements.redSlider.addEventListener('input', debouncedUpdateColor);
        this.elements.greenSlider.addEventListener('input', debouncedUpdateColor);
        this.elements.blueSlider.addEventListener('input', debouncedUpdateColor);
        
        // ボタンイベント（ダブルクリック防止付き）
        this.elements.submitBtn.addEventListener('click', this.debounce(() => {
            this.submitAnswer();
        }, 300));
        this.elements.newGameBtn.addEventListener('click', () => this.newGame());
        
        // キーボードショートカット
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.submitAnswer();
            } else if (event.key === 'r' || event.key === 'R') {
                event.preventDefault();
                this.newGame();
            }
        });
    }
    
    // デバウンス関数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    generateNewTargetColor() {
        // レベルに応じて色の範囲を調整
        const range = Math.max(50, 255 - (this.level - 1) * 20);
        const minValue = Math.max(0, 128 - range / 2);
        const maxValue = Math.min(255, 128 + range / 2);
        
        this.targetColor = {
            r: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
            g: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
            b: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        };
        
        this.updateTargetColorDisplay();
    }
    
    updatePlayerColor() {
        this.playerColor = {
            r: parseInt(this.elements.redSlider.value),
            g: parseInt(this.elements.greenSlider.value),
            b: parseInt(this.elements.blueSlider.value)
        };
        
        this.updatePlayerColorDisplay();
        this.updateSliderValues();
    }
    
    updateTargetColorDisplay() {
        const colorStr = `rgb(${this.targetColor.r}, ${this.targetColor.g}, ${this.targetColor.b})`;
        this.elements.targetColor.style.backgroundColor = colorStr;
        this.elements.targetRgb.textContent = `RGB(${this.targetColor.r}, ${this.targetColor.g}, ${this.targetColor.b})`;
    }
    
    updatePlayerColorDisplay() {
        const colorStr = `rgb(${this.playerColor.r}, ${this.playerColor.g}, ${this.playerColor.b})`;
        this.elements.playerColor.style.backgroundColor = colorStr;
        this.elements.playerRgb.textContent = `RGB(${this.playerColor.r}, ${this.playerColor.g}, ${this.playerColor.b})`;
    }
    
    updateSliderValues() {
        this.elements.redValue.textContent = this.playerColor.r;
        this.elements.greenValue.textContent = this.playerColor.g;
        this.elements.blueValue.textContent = this.playerColor.b;
    }
    
    calculateColorDifference() {
        const rDiff = Math.abs(this.targetColor.r - this.playerColor.r);
        const gDiff = Math.abs(this.targetColor.g - this.playerColor.g);
        const bDiff = Math.abs(this.targetColor.b - this.playerColor.b);
        
        return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    }
    
    calculateAccuracy() {
        const maxDifference = Math.sqrt(255 * 255 * 3); // 最大可能差
        const difference = this.calculateColorDifference();
        return Math.max(0, ((maxDifference - difference) / maxDifference) * 100);
    }
    
    calculatePoints(accuracy) {
        const basePoints = Math.floor(accuracy * 10);
        const levelBonus = (this.level - 1) * 5;
        const consecutiveBonus = this.consecutiveSuccesses * 10;
        
        return basePoints + levelBonus + consecutiveBonus;
    }
    
    submitAnswer() {
        const accuracy = this.calculateAccuracy();
        const points = this.calculatePoints(accuracy);
        
        this.score += points;
        
        // 結果表示
        this.showResult(accuracy, points);
        
        // 成功判定（80%以上で成功）
        if (accuracy >= 80) {
            this.consecutiveSuccesses++;
            this.checkLevelUp();
        } else {
            this.consecutiveSuccesses = 0;
        }
        
        // 最高スコア更新
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        this.updateDisplay();
        
        // 少し待ってから新しい問題を生成
        setTimeout(() => {
            this.generateNewTargetColor();
            this.resetPlayerColor();
            this.hideResult();
        }, 3000);
    }
    
    showResult(accuracy, points) {
        this.elements.accuracy.textContent = `正確度: ${accuracy.toFixed(1)}%`;
        this.elements.pointsEarned.textContent = `獲得ポイント: +${points}`;
        
        this.elements.resultDisplay.classList.add('show');
        
        // 正確度に応じて背景色を変更
        if (accuracy >= 90) {
            this.elements.resultDisplay.style.background = 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
        } else if (accuracy >= 70) {
            this.elements.resultDisplay.style.background = 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)';
        } else {
            this.elements.resultDisplay.style.background = 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)';
        }
    }
    
    hideResult() {
        this.elements.resultDisplay.classList.remove('show');
    }
    
    checkLevelUp() {
        const requiredSuccesses = 3 + (this.level - 1) * 2; // レベルが上がるほど必要成功数増加
        if (this.consecutiveSuccesses >= requiredSuccesses) {
            this.level++;
            this.consecutiveSuccesses = 0;
            this.showLevelUpMessage();
        }
    }
    
    showLevelUpMessage() {
        // レベルアップ時の特別な表示
        this.elements.accuracy.textContent = `🎉 レベルアップ！ レベル ${this.level} 🎉`;
        this.elements.pointsEarned.textContent = `おめでとうございます！`;
        this.elements.resultDisplay.style.background = 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)';
    }
    
    resetPlayerColor() {
        this.playerColor = { r: 128, g: 128, b: 128 };
        this.elements.redSlider.value = 128;
        this.elements.greenSlider.value = 128;
        this.elements.blueSlider.value = 128;
        this.updatePlayerColorDisplay();
        this.updateSliderValues();
    }
    
    newGame() {
        this.score = 0;
        this.level = 1;
        this.consecutiveSuccesses = 0;
        this.generateNewTargetColor();
        this.resetPlayerColor();
        this.hideResult();
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.elements.score.textContent = this.score.toLocaleString();
        this.elements.level.textContent = this.level;
        this.elements.highScore.textContent = this.highScore.toLocaleString();
    }
    
    loadHighScore() {
        return parseInt(localStorage.getItem('colorMatchHighScore')) || 0;
    }
    
    saveHighScore() {
        localStorage.setItem('colorMatchHighScore', this.highScore.toString());
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    // ページ読み込み完了後にゲームを初期化
    setTimeout(() => {
        new ColorMatchGame();
    }, 100);
    
    // パフォーマンス最適化: 画像のプリロードを避ける
    // リソースの使用を最小限に抑える
    
    // サービスワーカーの登録（オフライン対応）
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
}); 