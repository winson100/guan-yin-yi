/**
 * 存贷组合产品测算器 - 编辑产品页面逻辑
 */

class EditProductPage {
    constructor() {
        this.currentProductType = '';
        this.currentProductId = null;
        this.currentGroup = 'group1'; // 默认组
        
        // 即期外汇字段状态跟踪
        this.spotFieldStatus = {
            sellAmount: { isCalculated: false, lastModified: null },
            exchangeRate: { isCalculated: false, lastModified: null },
            buyAmount: { isCalculated: false, lastModified: null }
        };
        
        // 汇率默认值配置 (以CNY为基准)
        this.exchangeRates = {
            'CNY': {
                'USD': 0.14,    // 1 CNY = 0.14 USD
                'EUR': 0.13,    // 1 CNY = 0.13 EUR
                'GBP': 0.11,    // 1 CNY = 0.11 GBP
                'HKD': 1.09,    // 1 CNY = 1.09 HKD
                'JPY': 20.5,    // 1 CNY = 20.5 JPY
                'AUD': 0.21,    // 1 CNY = 0.21 AUD
                'CAD': 0.19,    // 1 CNY = 0.19 CAD
                'SGD': 0.19,    // 1 CNY = 0.19 SGD
                'CHF': 0.12     // 1 CNY = 0.12 CHF
            },
            'USD': {
                'CNY': 7.2,     // 1 USD = 7.2 CNY
                'EUR': 0.92,    // 1 USD = 0.92 EUR
                'GBP': 0.79,    // 1 USD = 0.79 GBP
                'HKD': 7.8,     // 1 USD = 7.8 HKD
                'JPY': 147.0,   // 1 USD = 147.0 JPY
                'AUD': 1.52,    // 1 USD = 1.52 AUD
                'CAD': 1.36,    // 1 USD = 1.36 CAD
                'SGD': 1.35,    // 1 USD = 1.35 SGD
                'CHF': 0.88     // 1 USD = 0.88 CHF
            },
            'EUR': {
                'CNY': 7.8,     // 1 EUR = 7.8 CNY
                'USD': 1.09,    // 1 EUR = 1.09 USD
                'GBP': 0.86,    // 1 EUR = 0.86 GBP
                'HKD': 8.5,     // 1 EUR = 8.5 HKD
                'JPY': 160.0,   // 1 EUR = 160.0 JPY
                'AUD': 1.66,    // 1 EUR = 1.66 AUD
                'CAD': 1.48,    // 1 EUR = 1.48 CAD
                'SGD': 1.47,    // 1 EUR = 1.47 SGD
                'CHF': 0.96     // 1 EUR = 0.96 CHF
            },
            'GBP': {
                'CNY': 9.1,     // 1 GBP = 9.1 CNY
                'USD': 1.27,    // 1 GBP = 1.27 USD
                'EUR': 1.16,    // 1 GBP = 1.16 EUR
                'HKD': 9.9,     // 1 GBP = 9.9 HKD
                'JPY': 186.0,   // 1 GBP = 186.0 JPY
                'AUD': 1.93,    // 1 GBP = 1.93 AUD
                'CAD': 1.72,    // 1 GBP = 1.72 CAD
                'SGD': 1.71,    // 1 GBP = 1.71 SGD
                'CHF': 1.12     // 1 GBP = 1.12 CHF
            },
            'HKD': {
                'CNY': 0.92,    // 1 HKD = 0.92 CNY
                'USD': 0.13,    // 1 HKD = 0.13 USD
                'EUR': 0.12,    // 1 HKD = 0.12 EUR
                'GBP': 0.10,    // 1 HKD = 0.10 GBP
                'JPY': 18.8,    // 1 HKD = 18.8 JPY
                'AUD': 0.19,    // 1 HKD = 0.19 AUD
                'CAD': 0.17,    // 1 HKD = 0.17 CAD
                'SGD': 0.17,    // 1 HKD = 0.17 SGD
                'CHF': 0.11     // 1 HKD = 0.11 CHF
            },
            'JPY': {
                'CNY': 0.049,   // 1 JPY = 0.049 CNY
                'USD': 0.0068,  // 1 JPY = 0.0068 USD
                'EUR': 0.0063,  // 1 JPY = 0.0063 EUR
                'GBP': 0.0054,  // 1 JPY = 0.0054 GBP
                'HKD': 0.053,   // 1 JPY = 0.053 HKD
                'AUD': 0.010,   // 1 JPY = 0.010 AUD
                'CAD': 0.0092,  // 1 JPY = 0.0092 CAD
                'SGD': 0.0092,  // 1 JPY = 0.0092 SGD
                'CHF': 0.0060   // 1 JPY = 0.0060 CHF
            },
            'AUD': {
                'CNY': 4.8,     // 1 AUD = 4.8 CNY
                'USD': 0.66,    // 1 AUD = 0.66 USD
                'EUR': 0.60,    // 1 AUD = 0.60 EUR
                'GBP': 0.52,    // 1 AUD = 0.52 GBP
                'HKD': 5.1,     // 1 AUD = 5.1 HKD
                'JPY': 97.0,    // 1 AUD = 97.0 JPY
                'CAD': 0.89,    // 1 AUD = 0.89 CAD
                'SGD': 0.89,    // 1 AUD = 0.89 SGD
                'CHF': 0.58     // 1 AUD = 0.58 CHF
            },
            'CAD': {
                'CNY': 5.4,     // 1 CAD = 5.4 CNY
                'USD': 0.74,    // 1 CAD = 0.74 USD
                'EUR': 0.68,    // 1 CAD = 0.68 EUR
                'GBP': 0.58,    // 1 CAD = 0.58 GBP
                'HKD': 5.7,     // 1 CAD = 5.7 HKD
                'JPY': 109.0,   // 1 CAD = 109.0 JPY
                'AUD': 1.12,    // 1 CAD = 1.12 AUD
                'SGD': 0.99,    // 1 CAD = 0.99 SGD
                'CHF': 0.65     // 1 CAD = 0.65 CHF
            },
            'SGD': {
                'CNY': 5.4,     // 1 SGD = 5.4 CNY
                'USD': 0.74,    // 1 SGD = 0.74 USD
                'EUR': 0.68,    // 1 SGD = 0.68 EUR
                'GBP': 0.58,    // 1 SGD = 0.58 GBP
                'HKD': 5.7,     // 1 SGD = 5.7 HKD
                'JPY': 109.0,   // 1 SGD = 109.0 JPY
                'AUD': 1.12,    // 1 SGD = 1.12 AUD
                'CAD': 1.01,    // 1 SGD = 1.01 CAD
                'CHF': 0.65     // 1 SGD = 0.65 CHF
            },
            'CHF': {
                'CNY': 8.3,     // 1 CHF = 8.3 CNY
                'USD': 1.14,    // 1 CHF = 1.14 USD
                'EUR': 1.04,    // 1 CHF = 1.04 EUR
                'GBP': 0.89,    // 1 CHF = 0.89 GBP
                'HKD': 8.9,     // 1 CHF = 8.9 HKD
                'JPY': 167.0,   // 1 CHF = 167.0 JPY
                'AUD': 1.73,    // 1 CHF = 1.73 AUD
                'CAD': 1.54,    // 1 CHF = 1.54 CAD
                'SGD': 1.54     // 1 CHF = 1.54 SGD
            }
        };
        
        this.init();
    }

    /**
     * 初始化页面
     */
    async init() {
        try {
            // 获取URL参数
            this.getUrlParams();
            
            // 初始化数据库
            await window.productDB.init();
            
            // 获取产品ID
            this.currentProductId = this.getProductIdFromUrl();
            if (!this.currentProductId) {
                this.showError('产品ID无效');
                return;
            }
            
            // 加载产品数据
            await this.loadProductData();
            
            // 绑定事件
            this.bindEvents();
            
        } catch (error) {
            console.error('页面初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }

    /**
     * 从URL参数获取产品ID
     */
    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        return productId ? parseInt(productId) : null;
    }

    /**
     * 加载产品数据
     */
    async loadProductData() {
        try {
            const product = await window.productDB.getProductById(this.currentProductId);
            if (!product) {
                this.showError('产品不存在');
                return;
            }

            // 填充表单数据
            this.fillFormData(product);
            
        } catch (error) {
            console.error('加载产品数据失败:', error);
            this.showError('加载产品数据失败');
        }
    }

    /**
     * 获取产品类型显示文本
     */
    getProductTypeDisplayText(type) {
        const typeMap = {
            'deposit': '存款',
            'loan': '贷款',
            'credit': '信用证',
            'spot': '即期',
            'derivative': '衍生',
            'foreign_spot': '即期',
            'foreign_forward': '远期',
            'foreign_swap': '掉期',
            'foreign_option': '期权'
        };
        return typeMap[type] || type;
    }

    /**
     * 获取币种显示文本
     */
    getCurrencyDisplayText(currency) {
        const currencyMap = {
            'CNY': 'CNY - 人民币',
            'USD': 'USD - 美元',
            'EUR': 'EUR - 欧元',
            'GBP': 'GBP - 英镑',
            'HKD': 'HKD - 港币',
            'JPY': 'JPY - 日元',
            'AUD': 'AUD - 澳元',
            'CAD': 'CAD - 加元',
            'SGD': 'SGD - 新加坡元',
            'CHF': 'CHF - 瑞士法郎'
        };
        return currencyMap[currency] || currency;
    }

    /**
     * 获取期限单位显示文本
     */
    getPeriodUnitDisplayText(unit) {
        const unitMap = {
            'year': '年',
            'month': '月',
            'day': '日'
        };
        return unitMap[unit] || unit;
    }

    /**
     * 获取外汇类型显示文本
     */
    getForeignTypeDisplayText(type) {
        const typeMap = {
            'foreign_spot': '即期',
            'foreign_forward': '远期',
            'foreign_swap': '掉期',
            'foreign_option': '期权'
        };
        return typeMap[type] || type;
    }

    /**
     * 填充表单数据
     */
    fillFormData(product) {
        // 设置产品种类
        let productTypeForSelect = product.type;
        if (product.type === 'foreign_spot') {
            productTypeForSelect = 'spot';
        } else if (product.type === 'foreign_forward') {
            productTypeForSelect = 'derivative';
        } else if (product.type === 'foreign_swap') {
            productTypeForSelect = 'derivative';
        } else if (product.type === 'foreign_option') {
            productTypeForSelect = 'derivative';
        }
        
        const productTypeField = document.getElementById('productType');
        productTypeField.value = this.getProductTypeDisplayText(productTypeForSelect);
        productTypeField.dataset.value = productTypeForSelect;
        this.currentProductType = productTypeForSelect;
        this.onProductTypeChange(productTypeForSelect);

        // 设置产品名称
        document.getElementById('productName').value = product.name;

        // 根据产品类型填充相应字段
        switch (product.type) {
            case 'deposit':
                this.fillDepositData(product);
                break;
            case 'loan':
                this.fillLoanData(product);
                break;
            case 'credit':
                this.fillCreditData(product);
                break;
            case 'foreign_spot':
            case 'foreign_forward':
            case 'foreign_swap':
            case 'foreign_option':
                this.fillForeignData(product);
                break;
        }
    }

    /**
     * 填充存款产品数据
     */
    fillDepositData(product) {
        const currencyField = document.getElementById('depositCurrency');
        currencyField.value = this.getCurrencyDisplayText(product.currency || 'CNY');
        currencyField.dataset.value = product.currency || 'CNY';
        
        document.getElementById('depositAmount').value = product.amount || '';
        document.getElementById('depositRate').value = product.rate || '';
        
        // 设置期限单位
        const periodUnitField = document.getElementById('depositPeriodUnit');
        periodUnitField.value = this.getPeriodUnitDisplayText(product.periodUnit || 'year');
        periodUnitField.dataset.value = product.periodUnit || 'year';
        
        document.getElementById('depositPeriod').value = product.period || '';
        document.getElementById('depositInterest').value = this.formatAmount(product.interest) || '';
        document.getElementById('depositPrincipal').value = this.formatAmount(product.principal) || '';
    }

    /**
     * 填充贷款产品数据
     */
    fillLoanData(product) {
        const currencyField = document.getElementById('loanCurrency');
        currencyField.value = this.getCurrencyDisplayText(product.currency || 'CNY');
        currencyField.dataset.value = product.currency || 'CNY';
        
        document.getElementById('loanAmount').value = product.amount || '';
        document.getElementById('loanRate').value = product.rate || '';
        
        // 设置期限单位
        const periodUnitField = document.getElementById('loanPeriodUnit');
        periodUnitField.value = this.getPeriodUnitDisplayText(product.periodUnit || 'year');
        periodUnitField.dataset.value = product.periodUnit || 'year';
        
        document.getElementById('loanPeriod').value = product.period || '';
        document.getElementById('loanInterest').value = this.formatAmount(product.interest) || '';
        document.getElementById('loanPrincipal').value = this.formatAmount(product.principal) || '';

        document.getElementById('loanFeeAmount').value = product.feeAmount || '';
    }

    /**
     * 填充信用证产品数据
     */
    fillCreditData(product) {
        const currencyField = document.getElementById('creditCurrency');
        currencyField.value = this.getCurrencyDisplayText(product.currency || 'CNY');
        currencyField.dataset.value = product.currency || 'CNY';
        
        document.getElementById('creditAmount').value = product.amount || '';
        
        // 设置有效期
        const expiryDateField = document.getElementById('creditExpiryDate');
        if (product.expiryDate) {
            expiryDateField.value = product.expiryDate;
            expiryDateField.dataset.value = product.expiryDate;
        }
        
        document.getElementById('creditFeeAmount').value = product.feeAmount || '';
    }

    /**
     * 填充外汇产品数据
     */
    fillForeignData(product) {
        // 根据产品类型设置产品名称
        if (product.type === 'foreign_forward') {
            const productNameField = document.getElementById('productName');
            productNameField.value = '远期';
            productNameField.dataset.value = 'forward';
        } else if (product.type === 'foreign_swap') {
            const productNameField = document.getElementById('productName');
            productNameField.value = '掉期';
            productNameField.dataset.value = 'swap';
        } else if (product.type === 'foreign_option') {
            const productNameField = document.getElementById('productName');
            productNameField.value = '期权';
            productNameField.dataset.value = 'option';
        }

        // 调用相应的类型变化处理
        if (product.type === 'foreign_spot') {
            // 即期产品显示即期/远期表单
            this.onDerivativeTypeChange('forward');
        } else if (product.type === 'foreign_forward') {
            this.onDerivativeTypeChange('forward');
        } else if (product.type === 'foreign_swap') {
            this.onDerivativeTypeChange('swap');
        } else if (product.type === 'foreign_option') {
            this.onDerivativeTypeChange('option');
        }

        if (product.type === 'foreign_swap') {
            // 掉期交易
            const nearSellCurrencyField = document.getElementById('nearSellCurrency');
            nearSellCurrencyField.value = this.getCurrencyDisplayText(product.nearSellCurrency || '');
            nearSellCurrencyField.dataset.value = product.nearSellCurrency || '';
            
            const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
            nearBuyCurrencyField.value = this.getCurrencyDisplayText(product.nearBuyCurrency || '');
            nearBuyCurrencyField.dataset.value = product.nearBuyCurrency || '';
            
            document.getElementById('nearSellAmount').value = product.nearSellAmount || '';
            document.getElementById('nearRate').value = product.nearRate || '';
            document.getElementById('nearBuyAmount').value = this.formatAmount(product.nearBuyAmount) || '';
            
            const farSellCurrencyField = document.getElementById('farSellCurrency');
            farSellCurrencyField.value = this.getCurrencyDisplayText(product.farSellCurrency || '');
            farSellCurrencyField.dataset.value = product.farSellCurrency || '';
            
            const farBuyCurrencyField = document.getElementById('farBuyCurrency');
            farBuyCurrencyField.value = this.getCurrencyDisplayText(product.farBuyCurrency || '');
            farBuyCurrencyField.dataset.value = product.farBuyCurrency || '';
            
            document.getElementById('farRate').value = product.farRate || '';
            document.getElementById('farBuyAmount').value = this.formatAmount(product.farBuyAmount) || '';
            document.getElementById('farSellAmount').value = this.formatAmount(product.farSellAmount) || '';
            document.getElementById('finalIncome').value = this.formatAmount(product.finalIncome) || '';
        } else if (product.type === 'foreign_option') {
            // 期权交易数据
            const optionFeeTypeField = document.getElementById('optionFeeType');
            if (product.optionFeeType) {
                const feeTypeText = product.optionFeeType === 'income' ? '收入' : '支出';
                optionFeeTypeField.value = feeTypeText;
                optionFeeTypeField.dataset.value = product.optionFeeType;
            }
            
            document.getElementById('optionFeeAmount').value = product.optionFeeAmount || '';
        } else {
            // 即期/远期交易
            const sellCurrencyField = document.getElementById('sellCurrency');
            sellCurrencyField.value = this.getCurrencyDisplayText(product.sellCurrency || '');
            sellCurrencyField.dataset.value = product.sellCurrency || '';
            
            const buyCurrencyField = document.getElementById('buyCurrency');
            buyCurrencyField.value = this.getCurrencyDisplayText(product.buyCurrency || '');
            buyCurrencyField.dataset.value = product.buyCurrency || '';
            
            document.getElementById('sellAmount').value = product.sellAmount || '';
            document.getElementById('exchangeRate').value = product.exchangeRate || '';
            document.getElementById('buyAmount').value = this.formatAmount(product.buyAmount) || '';
        }
    }

    /**
     * 获取URL参数
     */
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const group = urlParams.get('group');
        if (group && (group === 'group1' || group === 'group2')) {
            this.currentGroup = group;
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 返回按钮
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });

        // 首页按钮
        document.getElementById('homeBtn').addEventListener('click', () => {
            this.goHome();
        });

        // 取消按钮
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.goBack();
        });

        // 保存并返回按钮
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.handleSubmit();
        });

        // 产品种类选择
        document.getElementById('productType').addEventListener('click', () => {
            this.showProductTypeOptions();
        });

        // 产品名称选择 - 动态绑定事件
        const productNameField = document.getElementById('productName');
        productNameField.addEventListener('click', () => {
            // 只有衍生品类型才显示弹窗
            if (this.currentProductType === 'derivative') {
                this.showProductNameOptions();
            }
        });

        // 币种选择
        const currencyFields = [
            'depositCurrency', 'loanCurrency', 'creditCurrency',
            'sellCurrency', 'buyCurrency', 'nearSellCurrency', 'nearBuyCurrency',
            'farSellCurrency', 'farBuyCurrency'
        ];
        currencyFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('click', () => {
                    this.showCurrencyOptions(fieldId);
                });
            }
        });

        // 期限单位选择
        const periodUnitFields = ['depositPeriodUnit', 'loanPeriodUnit'];
        periodUnitFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('click', () => {
                    this.showPeriodUnitOptions(fieldId);
                });
            }
        });

        // 有效期选择
        const expiryDateField = document.getElementById('creditExpiryDate');
        if (expiryDateField) {
            expiryDateField.addEventListener('click', () => {
                this.showExpiryDateOptions();
            });
        }

        // 期权费用类型选择
        const optionFeeTypeField = document.getElementById('optionFeeType');
        if (optionFeeTypeField) {
            optionFeeTypeField.addEventListener('click', () => {
                this.showOptionFeeTypeOptions();
            });
        }

        // 表单提交
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // 存款产品字段变化监听
        this.bindDepositFields();
        
        // 贷款产品字段变化监听
        this.bindLoanFields();
        
        // 外汇产品字段变化监听
        this.bindForeignFields();
    }

    /**
     * 绑定存款产品字段事件
     */
    bindDepositFields() {
        const fields = ['depositAmount', 'depositRate', 'depositPeriod', 'depositPeriodUnit'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.calculateDeposit();
                });
            }
        });
    }

    /**
     * 绑定贷款产品字段事件
     */
    bindLoanFields() {
        const fields = ['loanAmount', 'loanRate', 'loanPeriod', 'loanPeriodUnit'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.calculateLoan();
                });
            }
        });
    }

    /**
     * 绑定外汇产品字段事件
     */
    bindForeignFields() {
        // 即期/远期字段
        const spotForwardFields = ['sellAmount', 'buyAmount', 'exchangeRate'];
        spotForwardFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.onSpotFieldInput(fieldId);
                });
                field.addEventListener('blur', () => {
                    this.onSpotFieldBlur(fieldId);
                });
            }
        });

        // 掉期近端字段
        const swapNearFields = ['nearSellAmount', 'nearRate'];
        swapNearFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.calculateSwap();
                });
            }
        });

        // 掉期远端字段
        const swapFarFields = ['farRate'];
        swapFarFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.calculateSwap();
                });
            }
        });
    }

    /**
     * 产品种类变化处理
     */
    onProductTypeChange(type) {
        this.currentProductType = type;
        
        // 隐藏所有产品表单
        document.querySelectorAll('.product-form-section').forEach(section => {
            section.style.display = 'none';
        });

        // 重置即期字段状态跟踪
        this.resetSpotFieldStatus();

        // 显示对应的产品表单
        if (type === 'deposit') {
            document.getElementById('depositForm').style.display = 'block';
        } else if (type === 'loan') {
            document.getElementById('loanForm').style.display = 'block';
        } else if (type === 'credit') {
            document.getElementById('creditForm').style.display = 'block';
        } else if (type === 'spot' || type === 'derivative') {
            document.getElementById('foreignForm').style.display = 'block';
        }
        
        // 更新产品名称显示
        this.updateProductNameDisplay(type);
    }

    /**
     * 重置即期字段状态跟踪
     */
    resetSpotFieldStatus() {
        this.spotFieldStatus = {
            sellAmount: { isCalculated: false, lastModified: null },
            exchangeRate: { isCalculated: false, lastModified: null },
            buyAmount: { isCalculated: false, lastModified: null }
        };
    }

    /**
     * 更新产品名称显示
     */
    updateProductNameDisplay(type) {
        const productNameContainer = document.getElementById('productNameContainer');
        const productNameField = document.getElementById('productName');
        const productNameArrow = document.getElementById('productNameArrow');
        const productNameLabel = document.getElementById('productNameLabel');
        
        if (type === 'deposit' || type === 'loan') {
            // 存款和贷款：手工输入，必输
            productNameContainer.style.display = 'block';
            productNameField.readOnly = false;
            productNameField.placeholder = '请输入产品名称';
            productNameArrow.style.display = 'none';
            productNameLabel.textContent = '产品名称';
        } else if (type === 'credit' || type === 'spot') {
            // 信用证和即期：隐藏
            productNameContainer.style.display = 'none';
        } else if (type === 'derivative') {
            // 衍生：下拉框，必输
            productNameContainer.style.display = 'block';
            productNameField.readOnly = true;
            productNameField.placeholder = '请选择产品名称';
            productNameArrow.style.display = 'block';
            productNameLabel.textContent = '产品名称';
        }
    }

    /**
     * 衍生品类型变化处理
     */
    onDerivativeTypeChange(type) {
        // 隐藏所有外汇子表单
        document.getElementById('spotForwardForm').style.display = 'none';
        document.getElementById('swapForm').style.display = 'none';
        document.getElementById('optionForm').style.display = 'none';

        // 显示对应的外汇子表单
        if (type === 'forward') {
            document.getElementById('spotForwardForm').style.display = 'block';
        } else if (type === 'swap') {
            document.getElementById('swapForm').style.display = 'block';
        } else if (type === 'option') {
            document.getElementById('optionForm').style.display = 'block';
        }
    }

    /**
     * 外汇类型变化处理
     */
    onForeignTypeChange(type) {
        this.currentForeignType = type;
        
        // 隐藏所有外汇子表单
        document.getElementById('spotForwardForm').style.display = 'none';
        document.getElementById('swapForm').style.display = 'none';

        // 显示对应的外汇子表单
        if (type === 'foreign_spot' || type === 'foreign_forward') {
            document.getElementById('spotForwardForm').style.display = 'block';
            // 更新即期/远期汇率提示
            this.updateExchangeRatePlaceholder();
        } else if (type === 'foreign_swap') {
            document.getElementById('swapForm').style.display = 'block';
            // 更新掉期汇率提示
            this.updateSwapRatePlaceholders();
        }
    }

    /**
     * 计算存款收益
     */
    calculateDeposit() {
        const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
        const rate = parseFloat(document.getElementById('depositRate').value) || 0;
        const period = parseInt(document.getElementById('depositPeriod').value) || 0;
        const periodUnitField = document.getElementById('depositPeriodUnit');
        const periodUnit = periodUnitField.dataset.value || 'year';

        if (amount > 0 && rate > 0 && period > 0) {
            // 根据期限单位调整计算
            let adjustedPeriod = period;
            if (periodUnit === 'month') {
                adjustedPeriod = period / 12; // 转换为年
            } else if (periodUnit === 'day') {
                adjustedPeriod = period / 365; // 转换为年
            }
            
            const interest = (amount * rate * adjustedPeriod) / 100;
            const principal = amount + interest;

            document.getElementById('depositInterest').value = this.formatAmount(interest);
            document.getElementById('depositPrincipal').value = this.formatAmount(principal);
        } else {
            document.getElementById('depositInterest').value = '';
            document.getElementById('depositPrincipal').value = '';
        }
    }

    /**
     * 计算贷款收益
     */
    calculateLoan() {
        const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const rate = parseFloat(document.getElementById('loanRate').value) || 0;
        const period = parseInt(document.getElementById('loanPeriod').value) || 0;
        const periodUnitField = document.getElementById('loanPeriodUnit');
        const periodUnit = periodUnitField.dataset.value || 'year';

        if (amount > 0 && rate > 0 && period > 0) {
            // 根据期限单位调整计算
            let adjustedPeriod = period;
            if (periodUnit === 'month') {
                adjustedPeriod = period / 12; // 转换为年
            } else if (periodUnit === 'day') {
                adjustedPeriod = period / 365; // 转换为年
            }
            
            const interest = (amount * rate * adjustedPeriod) / 100;
            const principal = amount + interest;

            document.getElementById('loanInterest').value = this.formatAmount(interest);
            document.getElementById('loanPrincipal').value = this.formatAmount(principal);
        } else {
            document.getElementById('loanInterest').value = '';
            document.getElementById('loanPrincipal').value = '';
        }
    }

    /**
     * 即期字段输入事件处理
     */
    onSpotFieldInput(fieldId) {
        // 记录字段被用户修改
        this.spotFieldStatus[fieldId].isCalculated = false;
        this.spotFieldStatus[fieldId].lastModified = Date.now();
        
        // 执行计算
        this.calculateSpotForward(fieldId);
    }

    /**
     * 即期字段失焦事件处理
     */
    onSpotFieldBlur(fieldId) {
        const field = document.getElementById(fieldId);
        const value = parseFloat(field.value) || 0;
        
        // 如果字段被清空，尝试根据其他两个字段重新计算
        if (value === 0 && field.value.trim() === '') {
            this.recalculateEmptyField(fieldId);
        }
    }

    /**
     * 重新计算被清空的字段
     */
    recalculateEmptyField(emptyFieldId) {
        const sellAmount = parseFloat(document.getElementById('sellAmount').value) || 0;
        const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 0;
        const buyAmount = parseFloat(document.getElementById('buyAmount').value) || 0;
        
        // 根据其他两个字段计算被清空的字段
        if (emptyFieldId === 'sellAmount' && exchangeRate > 0 && buyAmount > 0) {
            const calculatedValue = buyAmount / exchangeRate;
            document.getElementById('sellAmount').value = this.formatAmount(calculatedValue);
            this.spotFieldStatus.sellAmount.isCalculated = true;
        } else if (emptyFieldId === 'exchangeRate' && sellAmount > 0 && buyAmount > 0) {
            const calculatedValue = buyAmount / sellAmount;
            document.getElementById('exchangeRate').value = this.formatAmount(calculatedValue);
            this.spotFieldStatus.exchangeRate.isCalculated = true;
        } else if (emptyFieldId === 'buyAmount' && sellAmount > 0 && exchangeRate > 0) {
            const calculatedValue = sellAmount * exchangeRate;
            document.getElementById('buyAmount').value = this.formatAmount(calculatedValue);
            this.spotFieldStatus.buyAmount.isCalculated = true;
        }
    }

    /**
     * 计算即期/远期产品
     */
    calculateSpotForward(triggeredFieldId = '') {
        const sellAmount = parseFloat(document.getElementById('sellAmount').value) || 0;
        const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 0;
        const buyAmount = parseFloat(document.getElementById('buyAmount').value) || 0;

        // 统计有值的字段数量
        const fieldValues = { sellAmount, exchangeRate, buyAmount };
        const nonZeroFields = Object.keys(fieldValues).filter(key => fieldValues[key] > 0);
        
        // 如果少于2个字段有值，不进行计算
        if (nonZeroFields.length < 2) {
            return;
        }
        
        // 如果所有三个字段都有值，根据最后修改的字段确定计算方向
        if (nonZeroFields.length === 3) {
            this.handleThreeFieldsCalculation(triggeredFieldId, fieldValues);
            return;
        }
        
        // 如果恰好有两个字段有值，计算第三个字段
        if (nonZeroFields.length === 2) {
            this.handleTwoFieldsCalculation(nonZeroFields, fieldValues);
        }
    }

    /**
     * 处理三个字段都有值的情况
     */
    handleThreeFieldsCalculation(triggeredFieldId, fieldValues) {
        const { sellAmount, exchangeRate, buyAmount } = fieldValues;
        
        if (triggeredFieldId === 'sellAmount') {
            // 修改卖出金额，重新计算买入金额
            const newBuyAmount = sellAmount * exchangeRate;
            document.getElementById('buyAmount').value = this.formatAmount(newBuyAmount);
            this.spotFieldStatus.buyAmount.isCalculated = true;
            this.spotFieldStatus.sellAmount.isCalculated = false;
        } else if (triggeredFieldId === 'buyAmount') {
            // 修改买入金额，重新计算卖出金额
            const newSellAmount = buyAmount / exchangeRate;
            document.getElementById('sellAmount').value = this.formatAmount(newSellAmount);
            this.spotFieldStatus.sellAmount.isCalculated = true;
            this.spotFieldStatus.buyAmount.isCalculated = false;
        } else if (triggeredFieldId === 'exchangeRate') {
            // 修改汇率时，智能选择保持哪个金额字段
            this.handleExchangeRateChange(sellAmount, exchangeRate, buyAmount);
        }
    }

    /**
     * 处理汇率变化的智能计算
     */
    handleExchangeRateChange(sellAmount, exchangeRate, buyAmount) {
        // 获取最后被用户输入（非计算）的金额字段
        const sellAmountIsCalculated = this.spotFieldStatus.sellAmount.isCalculated;
        const buyAmountIsCalculated = this.spotFieldStatus.buyAmount.isCalculated;
        
        // 如果买入金额是计算出来的，保持卖出金额不变，重新计算买入金额
        if (buyAmountIsCalculated && !sellAmountIsCalculated) {
            const newBuyAmount = sellAmount * exchangeRate;
            document.getElementById('buyAmount').value = this.formatAmount(newBuyAmount);
            this.spotFieldStatus.buyAmount.isCalculated = true;
        }
        // 如果卖出金额是计算出来的，保持买入金额不变，重新计算卖出金额
        else if (sellAmountIsCalculated && !buyAmountIsCalculated) {
            const newSellAmount = buyAmount / exchangeRate;
            document.getElementById('sellAmount').value = this.formatAmount(newSellAmount);
            this.spotFieldStatus.sellAmount.isCalculated = true;
        }
        // 如果两个金额都是用户输入的，或者状态不明确，根据最后修改时间决定
        else {
            const sellLastModified = this.spotFieldStatus.sellAmount.lastModified || 0;
            const buyLastModified = this.spotFieldStatus.buyAmount.lastModified || 0;
            
            // 保持最后修改的金额字段不变
            if (buyLastModified > sellLastModified) {
                // 买入金额是最后修改的，保持买入金额，重新计算卖出金额
                const newSellAmount = buyAmount / exchangeRate;
                document.getElementById('sellAmount').value = this.formatAmount(newSellAmount);
                this.spotFieldStatus.sellAmount.isCalculated = true;
            } else {
                // 卖出金额是最后修改的，或者时间相同时默认保持卖出金额
                const newBuyAmount = sellAmount * exchangeRate;
                document.getElementById('buyAmount').value = this.formatAmount(newBuyAmount);
                this.spotFieldStatus.buyAmount.isCalculated = true;
            }
        }
        
        // 汇率本身不是计算出来的
        this.spotFieldStatus.exchangeRate.isCalculated = false;
    }

    /**
     * 处理两个字段有值的情况
     */
    handleTwoFieldsCalculation(nonZeroFields, fieldValues) {
        const { sellAmount, exchangeRate, buyAmount } = fieldValues;
        
        if (nonZeroFields.includes('sellAmount') && nonZeroFields.includes('exchangeRate')) {
            // 有卖出金额和汇率，计算买入金额
            const calculatedBuyAmount = sellAmount * exchangeRate;
            document.getElementById('buyAmount').value = this.formatAmount(calculatedBuyAmount);
            this.spotFieldStatus.buyAmount.isCalculated = true;
        } else if (nonZeroFields.includes('buyAmount') && nonZeroFields.includes('exchangeRate')) {
            // 有买入金额和汇率，计算卖出金额
            const calculatedSellAmount = buyAmount / exchangeRate;
            document.getElementById('sellAmount').value = this.formatAmount(calculatedSellAmount);
            this.spotFieldStatus.sellAmount.isCalculated = true;
        } else if (nonZeroFields.includes('sellAmount') && nonZeroFields.includes('buyAmount')) {
            // 有卖出金额和买入金额，计算汇率
            const calculatedExchangeRate = buyAmount / sellAmount;
            document.getElementById('exchangeRate').value = this.formatAmount(calculatedExchangeRate);
            this.spotFieldStatus.exchangeRate.isCalculated = true;
        }
    }

    /**
     * 计算掉期交易
     */
    calculateSwap() {
        const nearSellAmount = parseFloat(document.getElementById('nearSellAmount').value) || 0;
        const nearRate = parseFloat(document.getElementById('nearRate').value) || 0;
        const farRate = parseFloat(document.getElementById('farRate').value) || 0;

        // 计算近端买入金额（近端卖出金额 × 近端汇率）
        if (nearSellAmount > 0 && nearRate > 0) {
            const nearBuyAmount = nearSellAmount * nearRate;
            document.getElementById('nearBuyAmount').value = this.formatAmount(nearBuyAmount);
        } else {
            document.getElementById('nearBuyAmount').value = '';
        }

        // 计算远端相关金额
        if (nearSellAmount > 0 && nearRate > 0 && farRate > 0) {
            const nearBuyAmount = nearSellAmount * nearRate; // 近端买入金额
            
            // 新的远端金额计算逻辑
            const farBuyAmount = nearSellAmount; // 远端买入金额 = 近端卖出金额
            const farSellAmount = farBuyAmount / farRate; // 远端卖出金额 = 远端买入金额 ÷ 远端汇率
            
            document.getElementById('farSellAmount').value = this.formatAmount(farSellAmount);
            document.getElementById('farBuyAmount').value = this.formatAmount(farBuyAmount);
            
            // 期末收益计算公式：近端买入金额 - 近端卖出金额 × (1/远端汇率)
            // 收益币种按照近端买入币种
            const finalIncome = nearBuyAmount - (nearSellAmount / farRate);
            document.getElementById('finalIncome').value = this.formatAmount(finalIncome);
        } else {
            document.getElementById('farSellAmount').value = '';
            document.getElementById('farBuyAmount').value = '';
            document.getElementById('finalIncome').value = '';
        }
        
        // 更新期末收益币种显示
        this.updateFinalIncomeCurrency();
    }

    /**
     * 处理表单提交
     */
    async handleSubmit() {
        try {
            console.log('开始处理表单提交...');
            
            // 验证表单
            if (!this.validateForm()) {
                console.log('表单验证失败');
                return;
            }
            console.log('表单验证通过');

            // 收集表单数据
            const productData = this.collectFormData();
            console.log('收集到的产品数据:', productData);

            // 更新产品数据
            console.log('开始更新产品，ID:', this.currentProductId);
            const result = await window.productDB.updateProduct(this.currentProductId, productData);
            console.log('产品更新成功，结果:', result);

            // 显示成功消息
            this.showSuccess('产品更新成功！');

            // 延迟返回首页，让用户看到成功提示
            setTimeout(() => {
                this.goHome();
            }, 1500);

        } catch (error) {
            console.error('更新产品失败:', error);
            this.showError('更新产品失败: ' + error.message);
        }
    }

    /**
     * 验证表单
     */
    validateForm() {
        let isValid = true;
        this.clearAllErrors();

        // 验证产品种类
        const productType = document.getElementById('productType').value;
        if (!productType) {
            this.showFieldError('productType', '请选择产品种类');
            isValid = false;
        }

        // 验证产品名称
        const productName = document.getElementById('productName').value.trim();
        if (!productName) {
            this.showFieldError('productName', '请输入产品名称');
            isValid = false;
        } else if (productName.length > 50) {
            this.showFieldError('productName', '产品名称不能超过50个字符');
            isValid = false;
        }

        // 根据产品类型验证相应字段
        if (productType === 'deposit') {
            isValid = this.validateDepositForm() && isValid;
        } else if (productType === 'loan') {
            isValid = this.validateLoanForm() && isValid;
        } else if (productType === 'credit') {
            isValid = this.validateCreditForm() && isValid;
        } else if (productType === 'spot' || productType === 'derivative') {
            isValid = this.validateForeignForm() && isValid;
        }

        return isValid;
    }

    /**
     * 验证存款表单
     */
    validateDepositForm() {
        let isValid = true;

        const currency = document.getElementById('depositCurrency').value;
        const amount = parseFloat(document.getElementById('depositAmount').value);
        const rate = parseFloat(document.getElementById('depositRate').value);
        const period = parseFloat(document.getElementById('depositPeriod').value);

        if (!currency) {
            this.showFieldError('depositCurrency', '请选择币种');
            isValid = false;
        }

        if (!amount || amount <= 0) {
            this.showFieldError('depositAmount', '请输入有效金额');
            isValid = false;
        }

        if (!rate || rate <= 0) {
            this.showFieldError('depositRate', '请输入有效利率');
            isValid = false;
        }

        if (!period || period <= 0) {
            this.showFieldError('depositPeriod', '请输入有效期限');
            isValid = false;
        }

        return isValid;
    }

    /**
     * 验证贷款表单
     */
    validateLoanForm() {
        let isValid = true;

        const currency = document.getElementById('loanCurrency').value;
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const rate = parseFloat(document.getElementById('loanRate').value);
        const period = parseFloat(document.getElementById('loanPeriod').value);

        if (!currency) {
            this.showFieldError('loanCurrency', '请选择币种');
            isValid = false;
        }

        if (!amount || amount <= 0) {
            this.showFieldError('loanAmount', '请输入有效金额');
            isValid = false;
        }

        if (!rate || rate <= 0) {
            this.showFieldError('loanRate', '请输入有效利率');
            isValid = false;
        }

        if (!period || period <= 0) {
            this.showFieldError('loanPeriod', '请输入有效期限');
            isValid = false;
        }

        return isValid;
    }

    /**
     * 验证信用证表单
     */
    validateCreditForm() {
        let isValid = true;

        const currency = document.getElementById('creditCurrency').value;
        const amount = parseFloat(document.getElementById('creditAmount').value);
        const expiryDate = document.getElementById('creditExpiryDate').value;
        const feeAmount = parseFloat(document.getElementById('creditFeeAmount').value);

        if (!currency) {
            this.showFieldError('creditCurrency', '请选择币种');
            isValid = false;
        }

        if (!amount || amount <= 0) {
            this.showFieldError('creditAmount', '请输入有效金额');
            isValid = false;
        }

        if (!expiryDate) {
            this.showFieldError('creditExpiryDate', '请选择有效期');
            isValid = false;
        }

        if (!feeAmount || feeAmount <= 0) {
            this.showFieldError('creditFeeAmount', '请输入有效手续费金额');
            isValid = false;
        }

        return isValid;
    }

    /**
     * 验证外汇表单
     */
    validateForeignForm() {
        let isValid = true;

        // 获取产品名称以确定具体的产品类型
        const productNameField = document.getElementById('productName');
        const productName = productNameField.dataset.value || '';
        
        // 如果是期权产品，验证期权字段
        if (productName === 'option') {
            return this.validateOptionFields();
        }

        if (foreignType === 'foreign_spot' || foreignType === 'foreign_forward') {
            // 验证即期/远期表单
            const sellCurrency = document.getElementById('sellCurrency').value;
            const buyCurrency = document.getElementById('buyCurrency').value;

            if (!sellCurrency) {
                this.showFieldError('sellCurrency', '请选择卖出币种');
                isValid = false;
            }

            if (!buyCurrency) {
                this.showFieldError('buyCurrency', '请选择买入币种');
                isValid = false;
            }

            if (sellCurrency === buyCurrency) {
                this.showFieldError('buyCurrency', '买入币种不能与卖出币种相同');
                isValid = false;
            }

            // 获取三个字段的值
            const sellAmount = parseFloat(document.getElementById('sellAmount').value) || 0;
            const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 0;
            const buyAmount = parseFloat(document.getElementById('buyAmount').value) || 0;

            // 统计有值的字段数量
            const fieldValues = { sellAmount, exchangeRate, buyAmount };
            const nonZeroFields = Object.keys(fieldValues).filter(key => fieldValues[key] > 0);

            // 至少需要有两个字段有值
            if (nonZeroFields.length < 2) {
                if (sellAmount <= 0) {
                    this.showFieldError('sellAmount', '卖出金额需为正数且保留2位小数');
                    isValid = false;
                }
                if (exchangeRate <= 0) {
                    this.showFieldError('exchangeRate', '汇率需为正数');
                    isValid = false;
                }
                if (buyAmount <= 0) {
                    this.showFieldError('buyAmount', '买入金额需为正数且保留2位小数');
                    isValid = false;
                }
            } else {
                // 验证有值字段的数值范围
                if (sellAmount > 0) {
                    if (sellAmount > 999999999.99) {
                        this.showFieldError('sellAmount', '卖出金额不能超过999,999,999.99');
                        isValid = false;
                    }
                }
                
                if (exchangeRate > 0) {
                    if (exchangeRate > 9999.99) {
                        this.showFieldError('exchangeRate', '汇率不能超过9999.99');
                        isValid = false;
                    }
                }
                
                if (buyAmount > 0) {
                    if (buyAmount > 999999999.99) {
                        this.showFieldError('buyAmount', '买入金额不能超过999,999,999.99');
                        isValid = false;
                    }
                }
            }
        } else if (foreignType === 'foreign_swap') {
            // 验证掉期表单
            const nearSellCurrency = document.getElementById('nearSellCurrency').value;
            const nearBuyCurrency = document.getElementById('nearBuyCurrency').value;
            const nearSellAmount = parseFloat(document.getElementById('nearSellAmount').value);
            const nearRate = parseFloat(document.getElementById('nearRate').value);
            const farRate = parseFloat(document.getElementById('farRate').value);

            if (!nearSellCurrency) {
                this.showFieldError('nearSellCurrency', '请选择近端卖出币种');
                isValid = false;
            }

            if (!nearBuyCurrency) {
                this.showFieldError('nearBuyCurrency', '请选择近端买入币种');
                isValid = false;
            }

            if (nearSellCurrency === nearBuyCurrency) {
                this.showFieldError('nearBuyCurrency', '近端买入币种不能与卖出币种相同');
                isValid = false;
            }

            if (!nearSellAmount || nearSellAmount <= 0) {
                this.showFieldError('nearSellAmount', '请输入有效近端卖出金额');
                isValid = false;
            }

            if (!nearRate || nearRate <= 0) {
                this.showFieldError('nearRate', '请输入有效近端汇率');
                isValid = false;
            }

            if (!farRate || farRate <= 0) {
                this.showFieldError('farRate', '请输入有效远端汇率');
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * 验证期权表单
     */
    validateOptionFields() {
        let isValid = true;

        const optionFeeType = document.getElementById('optionFeeType').value;
        const optionFeeAmount = parseFloat(document.getElementById('optionFeeAmount').value);

        if (!optionFeeType) {
            this.showFieldError('optionFeeType', '请选择期权费用类型');
            isValid = false;
        }

        if (!optionFeeAmount || optionFeeAmount <= 0) {
            this.showFieldError('optionFeeAmount', '请输入有效期权费金额');
            isValid = false;
        } else if (optionFeeAmount > 999999999.99) {
            this.showFieldError('optionFeeAmount', '期权费金额不能超过999,999,999.99');
            isValid = false;
        }

        return isValid;
    }

    /**
     * 收集表单数据
     */
    collectFormData() {
        const productTypeField = document.getElementById('productType');
        const productType = productTypeField.dataset.value || productTypeField.value;

        // 根据产品类型处理产品名称
        let productName = '';
        if (productType === 'deposit' || productType === 'loan') {
            productName = document.getElementById('productName').value.trim();
        } else if (productType === 'derivative') {
            productName = document.getElementById('productName').dataset.value || '';
        }
        // 信用证和即期不需要产品名称

        const baseData = {
            type: productType,
            name: productName,
            group: this.currentGroup
        };

        if (productType === 'deposit' || productType === 'loan') {
            return this.collectDepositLoanData(baseData, productType);
        } else if (productType === 'credit') {
            return this.collectCreditData(baseData);
        } else if (productType === 'spot' || productType === 'derivative') {
            return this.collectForeignData(baseData, productType);
        }

        return null;
    }

    /**
     * 收集存款产品数据
     */
    collectDepositData() {
        const amount = parseFloat(document.getElementById('depositAmount').value);
        const rate = parseFloat(document.getElementById('depositRate').value);
        const period = parseFloat(document.getElementById('depositPeriod').value);
        const interest = amount * rate / 100 * period;
        const principal = amount + interest;

        const currencyField = document.getElementById('depositCurrency');
        const currency = currencyField.dataset.value || currencyField.value;
        
        const feeCurrencyField = document.getElementById('depositFeeCurrency');
        const feeCurrency = feeCurrencyField.dataset.value || feeCurrencyField.value;

        return {
            currency: currency,
            amount: amount,
            rate: rate,
            period: period,
            interest: interest,
            principal: principal,
            feeCurrency: feeCurrency || null,
            feeAmount: parseFloat(document.getElementById('depositFeeAmount').value) || null
        };
    }

    /**
     * 收集信用证数据
     */
    collectCreditData(baseData) {
        const currencyField = document.getElementById('creditCurrency');
        const currency = currencyField.dataset.value || currencyField.value;

        const expiryDateField = document.getElementById('creditExpiryDate');
        const expiryDate = expiryDateField.dataset.value || expiryDateField.value;

        const data = {
            ...baseData,
            currency: currency,
            amount: parseFloat(document.getElementById('creditAmount').value),
            expiryDate: expiryDate,
            feeAmount: parseFloat(document.getElementById('creditFeeAmount').value)
        };

        return data;
    }

    /**
     * 收集存款/贷款数据
     */
    collectDepositLoanData(baseData, type) {
        const prefix = type === 'deposit' ? 'deposit' : 'loan';
        
        const currencyField = document.getElementById(`${prefix}Currency`);
        const currency = currencyField.dataset.value || currencyField.value;
        
        const periodUnitField = document.getElementById(`${prefix}PeriodUnit`);
        const periodUnit = periodUnitField.dataset.value || periodUnitField.value;
        
        const data = {
            ...baseData,
            currency: currency,
            amount: parseFloat(document.getElementById(`${prefix}Amount`).value),
            rate: parseFloat(document.getElementById(`${prefix}Rate`).value),
            period: parseInt(document.getElementById(`${prefix}Period`).value),
            periodUnit: periodUnit,
            interest: parseFloat(document.getElementById(`${prefix}Interest`).value) || 0,
            principal: parseFloat(document.getElementById(`${prefix}Principal`).value) || 0
        };
        
        // 只有贷款产品才收集手续费
        if (prefix === 'loan') {
            data.feeAmount = parseFloat(document.getElementById(`${prefix}FeeAmount`).value) || null;
        }
        
        return data;
    }

    /**
     * 收集贷款产品数据
     */
    collectLoanData() {
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const rate = parseFloat(document.getElementById('loanRate').value);
        const period = parseFloat(document.getElementById('loanPeriod').value);
        const interest = amount * rate / 100 * period;
        const principal = amount + interest;

        const currencyField = document.getElementById('loanCurrency');
        const currency = currencyField.dataset.value || currencyField.value;

        return {
            currency: currency,
            amount: amount,
            rate: rate,
            period: period,
            interest: interest,
            principal: principal,
            feeAmount: parseFloat(document.getElementById('loanFeeAmount').value) || null
        };
    }

    /**
     * 收集外汇产品数据
     */
    collectForeignData(baseData, productType) {
        let foreignType = '';
        if (productType === 'spot') {
            foreignType = 'foreign_spot';
        } else if (productType === 'derivative') {
            const productName = document.getElementById('productName').dataset.value;
            if (productName === 'forward') {
                foreignType = 'foreign_forward';
            } else if (productName === 'swap') {
                foreignType = 'foreign_swap';
            } else if (productName === 'option') {
                foreignType = 'foreign_option';
            }
        }

        const data = {
            ...baseData,
            type: foreignType
        };

        if (foreignType === 'foreign_spot' || foreignType === 'foreign_forward') {
            const sellCurrencyField = document.getElementById('sellCurrency');
            const sellCurrency = sellCurrencyField.dataset.value || sellCurrencyField.value;
            const buyCurrencyField = document.getElementById('buyCurrency');
            const buyCurrency = buyCurrencyField.dataset.value || buyCurrencyField.value;
            
            Object.assign(data, {
                sellCurrency: sellCurrency,
                buyCurrency: buyCurrency,
                sellAmount: parseFloat(document.getElementById('sellAmount').value),
                exchangeRate: parseFloat(document.getElementById('exchangeRate').value),
                buyAmount: parseFloat(document.getElementById('buyAmount').value) || 0
            });
        } else if (foreignType === 'foreign_swap') {
            // 掉期交易数据
            const nearSellAmount = parseFloat(document.getElementById('nearSellAmount').value);
            const nearRate = parseFloat(document.getElementById('nearRate').value);
            const farRate = parseFloat(document.getElementById('farRate').value);
            const nearBuyAmount = nearSellAmount * nearRate;
            
            // 新的远端金额计算逻辑
            const farBuyAmount = nearSellAmount; // 远端买入金额 = 近端卖出金额
            const farSellAmount = farBuyAmount / farRate; // 远端卖出金额 = 远端买入金额 ÷ 远端汇率
            
            // 期末收益计算公式：近端买入金额 - 近端卖出金额 × (1/远端汇率)
            const finalIncome = nearBuyAmount - (nearSellAmount / farRate);

            const nearSellCurrencyField = document.getElementById('nearSellCurrency');
            const nearSellCurrency = nearSellCurrencyField.dataset.value || nearSellCurrencyField.value;
            
            const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
            const nearBuyCurrency = nearBuyCurrencyField.dataset.value || nearBuyCurrencyField.value;
            
            const farSellCurrencyField = document.getElementById('farSellCurrency');
            const farSellCurrency = farSellCurrencyField.dataset.value || farSellCurrencyField.value;
            
            const farBuyCurrencyField = document.getElementById('farBuyCurrency');
            const farBuyCurrency = farBuyCurrencyField.dataset.value || farBuyCurrencyField.value;

            Object.assign(data, {
                nearSellCurrency: nearSellCurrency,
                nearBuyCurrency: nearBuyCurrency,
                nearSellAmount: nearSellAmount,
                nearRate: nearRate,
                nearBuyAmount: nearBuyAmount,
                farSellCurrency: farSellCurrency,
                farBuyCurrency: farBuyCurrency,
                farRate: farRate,
                farBuyAmount: farBuyAmount,
                farSellAmount: farSellAmount,
                finalIncome: finalIncome
            });
        } else if (foreignType === 'foreign_option') {
            // 期权交易数据
            const optionFeeTypeField = document.getElementById('optionFeeType');
            const optionFeeType = optionFeeTypeField.dataset.value || optionFeeTypeField.value;
            
            Object.assign(data, {
                optionFeeType: optionFeeType,
                optionFeeAmount: parseFloat(document.getElementById('optionFeeAmount').value)
            });
        }
        
        return data;
    }

    /**
     * 显示字段错误
     */
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * 清除所有错误提示
     */
    clearAllErrors() {
        const errorElements = document.querySelectorAll('.input-error');
        errorElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    /**
     * 格式化金额
     */
    formatAmount(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return '';
        }
        return parseFloat(amount).toFixed(2);
    }

    /**
     * 返回上一页
     */
    goBack() {
        window.history.back();
    }

    /**
     * 跳转到首页
     */
    goHome() {
        window.location.href = 'index.html';
    }



    /**
     * 显示错误信息
     */
    showError(message) {
        this.showMessage(message, 'error');
    }

    /**
     * 显示成功信息
     */
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    /**
     * 显示消息
     */
    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `${type}-message`;
        messageElement.textContent = message;
        
        // 修复：使用正确的容器类名
        const container = document.querySelector('.scrollable-main-content');
        if (container) {
            container.insertBefore(messageElement, container.firstChild);
        } else {
            // 备用方案：如果找不到主容器，就添加到body
            document.body.appendChild(messageElement);
        }
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    /**
     * 显示产品种类选项列表
     */
    showProductTypeOptions() {
        const mask = document.getElementById('productTypeMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmProductTypeSelection();
        };
        
        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });
        
        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认产品种类选择
     */
    confirmProductTypeSelection() {
        const mask = document.getElementById('productTypeMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');
        
        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;
            
            // 更新输入框显示和存储实际值
            const inputField = document.getElementById('productType');
            inputField.value = text;
            inputField.dataset.value = value;
            
            // 处理产品种类变化
            this.onProductTypeChange(value);
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }

    /**
     * 显示产品名称选项列表
     */
    showProductNameOptions() {
        const mask = document.getElementById('productNameMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmProductNameSelection();
        };
        
        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 清除其他选项的选中状态
                options.forEach(opt => {
                    const icon = opt.querySelector('.selected-icon');
                    icon.classList.add('not-selected');
                });
                
                // 设置当前选项为选中状态
                const icon = option.querySelector('.selected-icon');
                icon.classList.remove('not-selected');
            };
        });
    }

    /**
     * 确认产品名称选择
     */
    confirmProductNameSelection() {
        const mask = document.getElementById('productNameMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');
        
        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;
            
            // 更新输入框显示和存储实际值
            const inputField = document.getElementById('productName');
            inputField.value = text;
            inputField.dataset.value = value;
            
            // 处理衍生品类型变化
            this.onDerivativeTypeChange(value);
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }

    /**
     * 显示币种选项列表
     */
    showCurrencyOptions(fieldId) {
        const mask = document.getElementById('currencyMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmCurrencySelection(fieldId);
        };
        
        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });
        
        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认币种选择
     */
    confirmCurrencySelection(fieldId) {
        const mask = document.getElementById('currencyMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');
        
        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;
            
            // 更新输入框显示和存储实际值
            const inputField = document.getElementById(fieldId);
            inputField.value = text;
            inputField.dataset.value = value;
            
            // 根据更新的币种更新汇率提示
            this.updateExchangeRatePlaceholders(fieldId);
            
            // 自动填充手续费币种
            this.autoFillFeeCurrency(fieldId, value, text);
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }

    /**
     * 显示外汇类型选项列表
     */
    showForeignTypeOptions() {
        const mask = document.getElementById('foreignTypeMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmForeignTypeSelection();
        };
        
        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });
        
        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认外汇类型选择
     */
    confirmForeignTypeSelection() {
        const mask = document.getElementById('foreignTypeMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');
        
        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;
            
            // 更新输入框显示和存储实际值
            const inputField = document.getElementById('foreignType');
            inputField.value = text;
            inputField.dataset.value = value;
            
            // 处理外汇类型变化
            this.onForeignTypeChange(value);
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }

    /**
     * 获取汇率默认值
     */
    getExchangeRate(sellCurrency, buyCurrency) {
        if (!sellCurrency || !buyCurrency || sellCurrency === buyCurrency) {
            return null;
        }
        
        // 直接查找汇率
        if (this.exchangeRates[sellCurrency] && this.exchangeRates[sellCurrency][buyCurrency]) {
            return this.exchangeRates[sellCurrency][buyCurrency];
        }
        
        // 如果直接查找不到，尝试反向查找并计算倒数
        if (this.exchangeRates[buyCurrency] && this.exchangeRates[buyCurrency][sellCurrency]) {
            return 1 / this.exchangeRates[buyCurrency][sellCurrency];
        }
        
        return null;
    }

    /**
     * 更新即期/远期汇率提示和默认值
     */
    updateExchangeRatePlaceholder() {
        const sellCurrencyField = document.getElementById('sellCurrency');
        const buyCurrencyField = document.getElementById('buyCurrency');
        const sellCurrency = sellCurrencyField.dataset.value || '';
        const buyCurrency = buyCurrencyField.dataset.value || '';
        const exchangeRateField = document.getElementById('exchangeRate');
        
        if (sellCurrency && buyCurrency) {
            const placeholder = `请输入${sellCurrency}兑${buyCurrency}汇率`;
            exchangeRateField.placeholder = placeholder;
            
            // 如果汇率字段为空，自动填充默认汇率
            if (!exchangeRateField.value) {
                const defaultRate = this.getExchangeRate(sellCurrency, buyCurrency);
                if (defaultRate !== null) {
                    exchangeRateField.value = defaultRate.toFixed(4);
                }
            }
        } else {
            exchangeRateField.placeholder = '请输入汇率';
        }
    }

    /**
     * 更新掉期汇率提示和默认值
     */
    updateSwapRatePlaceholders() {
        const nearSellCurrencyField = document.getElementById('nearSellCurrency');
        const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
        const farSellCurrencyField = document.getElementById('farSellCurrency');
        const farBuyCurrencyField = document.getElementById('farBuyCurrency');
        
        const nearSellCurrency = nearSellCurrencyField.dataset.value || '';
        const nearBuyCurrency = nearBuyCurrencyField.dataset.value || '';
        
        const nearRateField = document.getElementById('nearRate');
        const farRateField = document.getElementById('farRate');
        
        // 近端汇率提示：近端卖出币种兑近端买入币种
        if (nearSellCurrency && nearBuyCurrency) {
            const nearPlaceholder = `请输入${nearSellCurrency}兑${nearBuyCurrency}汇率`;
            nearRateField.placeholder = nearPlaceholder;
            
            // 如果近端汇率字段为空，自动填充默认汇率
            if (!nearRateField.value) {
                const defaultRate = this.getExchangeRate(nearSellCurrency, nearBuyCurrency);
                if (defaultRate !== null) {
                    nearRateField.value = defaultRate.toFixed(4);
                }
            }
        } else {
            nearRateField.placeholder = '请输入近端汇率';
        }
        
        // 远端汇率提示：远端卖出币种兑远端买入币种
        // 根据掉期币种关联关系：远端卖出币种 = 近端买入币种，远端买入币种 = 近端卖出币种
        if (nearBuyCurrency && nearSellCurrency) {
            const farPlaceholder = `请输入${nearBuyCurrency}兑${nearSellCurrency}汇率`;
            farRateField.placeholder = farPlaceholder;
            
            // 如果远端汇率字段为空，自动填充默认汇率
            if (!farRateField.value) {
                const defaultRate = this.getExchangeRate(nearBuyCurrency, nearSellCurrency);
                if (defaultRate !== null) {
                    farRateField.value = defaultRate.toFixed(4);
                }
            }
        } else {
            farRateField.placeholder = '请输入远端汇率';
        }
    }

    /**
     * 更新期末收益币种显示
     */
    updateFinalIncomeCurrency() {
        const currencyLabel = document.getElementById('finalIncomeCurrency');
        if (!currencyLabel) return;
        
        // 掉期产品：期末收益按照近端买入币种计算
        if (this.currentProductType === 'foreign' && this.currentForeignType === 'foreign_swap') {
            const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
            const nearBuyCurrency = nearBuyCurrencyField.dataset.value || '';
            if (nearBuyCurrency) {
                currencyLabel.textContent = `(${nearBuyCurrency})`;
            } else {
                currencyLabel.textContent = '';
            }
        } else {
            currencyLabel.textContent = '';
        }
    }

    /**
     * 自动填充手续费币种
     */
    autoFillFeeCurrency(fieldId, currencyValue, currencyText) {
        // 存款产品：币种自动带入手续费币种
        if (this.currentProductType === 'deposit' && fieldId === 'depositCurrency') {
            const feeCurrencyField = document.getElementById('depositFeeCurrency');
            feeCurrencyField.value = currencyText;
            feeCurrencyField.dataset.value = currencyValue;
        }
        
        // 贷款产品：币种自动带入手续费币种
        if (this.currentProductType === 'loan' && fieldId === 'loanCurrency') {
            const feeCurrencyField = document.getElementById('loanFeeCurrency');
            feeCurrencyField.value = currencyText;
            feeCurrencyField.dataset.value = currencyValue;
        }
        
        // 外汇产品：即期/远期，卖出币种自动带入手续费币种
        if (this.currentProductType === 'foreign' && 
            (this.currentForeignType === 'foreign_spot' || this.currentForeignType === 'foreign_forward') && 
            fieldId === 'sellCurrency') {
            const feeCurrencyField = document.getElementById('foreignFeeCurrency');
            feeCurrencyField.value = currencyText;
            feeCurrencyField.dataset.value = currencyValue;
        }
        
        // 外汇产品：掉期，近端卖出币种自动带入手续费币种
        if (this.currentProductType === 'foreign' && 
            this.currentForeignType === 'foreign_swap' && 
            fieldId === 'nearSellCurrency') {
            const feeCurrencyField = document.getElementById('foreignFeeCurrency');
            feeCurrencyField.value = currencyText;
            feeCurrencyField.dataset.value = currencyValue;
        }
    }

    /**
     * 更新掉期币种字段关联
     */
    updateSwapCurrencyFields() {
        const nearSellCurrencyField = document.getElementById('nearSellCurrency');
        const nearBuyCurrencyField = document.getElementById('nearBuyCurrency');
        const farSellCurrencyField = document.getElementById('farSellCurrency');
        const farBuyCurrencyField = document.getElementById('farBuyCurrency');
        
        const nearSellCurrency = nearSellCurrencyField.dataset.value || '';
        const nearBuyCurrency = nearBuyCurrencyField.dataset.value || '';
        const nearSellCurrencyText = nearSellCurrencyField.value || '';
        const nearBuyCurrencyText = nearBuyCurrencyField.value || '';
        
        // 当选择近端卖出币种时，自动设置为远端买入币种
        if (nearSellCurrency && nearSellCurrencyText) {
            farBuyCurrencyField.value = nearSellCurrencyText;
            farBuyCurrencyField.dataset.value = nearSellCurrency;
            
            // 自动填充手续费币种
            this.autoFillFeeCurrency('nearSellCurrency', nearSellCurrency, nearSellCurrencyText);
        }
        
        // 当选择近端买入币种时，自动设置为远端卖出币种
        if (nearBuyCurrency && nearBuyCurrencyText) {
            farSellCurrencyField.value = nearBuyCurrencyText;
            farSellCurrencyField.dataset.value = nearBuyCurrency;
            
            // 更新期末收益币种显示
            this.updateFinalIncomeCurrency();
        }
    }

    /**
     * 根据字段ID更新相应的汇率提示
     */
    updateExchangeRatePlaceholders(fieldId) {
        // 即期/远期汇率字段
        if (fieldId === 'sellCurrency' || fieldId === 'buyCurrency') {
            this.updateExchangeRatePlaceholder();
        }
        // 掉期汇率字段
        else if (['nearSellCurrency', 'nearBuyCurrency', 'farSellCurrency', 'farBuyCurrency'].includes(fieldId)) {
            this.updateSwapRatePlaceholders();
            // 对于掉期币种字段，还需要更新币种关联
            if (['nearSellCurrency', 'nearBuyCurrency'].includes(fieldId)) {
                this.updateSwapCurrencyFields();
            }
        }
    }

    /**
     * 显示期限单位选项列表
     */
    showPeriodUnitOptions(fieldId) {
        const mask = document.getElementById('periodUnitMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmPeriodUnitSelection(fieldId);
        };
        
        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });
        
        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认期限单位选择
     */
    confirmPeriodUnitSelection(fieldId) {
        const mask = document.getElementById('periodUnitMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');
        
        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;
            
            // 更新输入框显示和存储实际值
            const inputField = document.getElementById(fieldId);
            inputField.value = text;
            inputField.dataset.value = value;
            
            // 重新计算利息和本息
            if (fieldId === 'depositPeriodUnit') {
                this.calculateDeposit();
            } else if (fieldId === 'loanPeriodUnit') {
                this.calculateLoan();
            }
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }

    /**
     * 显示有效期选择选项
     */
    showExpiryDateOptions() {
        const mask = document.getElementById('expiryDateMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmExpiryDateSelection();
        };
        
        // 让组件库的JavaScript自动处理日期选择器初始化
        
        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认有效期选择
     */
    confirmExpiryDateSelection() {
        const mask = document.getElementById('expiryDateMask');
        
        // 获取选中的年、月、日
        const yearColumn = mask.querySelector('#yearColumn');
        const monthColumn = mask.querySelector('#monthColumn');
        const dayColumn = mask.querySelector('#dayColumn');
        
        const selectedYear = yearColumn.querySelector('.date-item.selected')?.textContent;
        const selectedMonth = monthColumn.querySelector('.date-item.selected')?.textContent;
        const selectedDay = dayColumn.querySelector('.date-item.selected')?.textContent;
        
        if (selectedYear && selectedMonth && selectedDay) {
            // 格式化日期显示
            const monthNumber = selectedMonth.replace('月', '');
            const dayNumber = selectedDay.replace('日', '');
            const formattedDate = `${selectedYear}-${monthNumber.padStart(2, '0')}-${dayNumber.padStart(2, '0')}`;
            
            // 更新输入框
            const inputField = document.getElementById('creditExpiryDate');
            inputField.value = formattedDate;
            inputField.dataset.value = formattedDate;
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }

    /**
     * 显示期权费用类型选项列表
     */
    showOptionFeeTypeOptions() {
        const mask = document.getElementById('optionFeeTypeMask');
        mask.style.display = 'flex';
        
        // 绑定确定按钮事件
        const confirmBtn = mask.querySelector('.popup-title-action-btn');
        confirmBtn.onclick = () => {
            this.confirmOptionFeeTypeSelection();
        };
        
        // 绑定选项点击事件
        const options = mask.querySelectorAll('.form-option');
        options.forEach(option => {
            option.onclick = () => {
                // 移除其他选中状态
                options.forEach(o => {
                    o.querySelector('.selected-icon').classList.add('not-selected');
                });
                // 添加当前选中状态
                option.querySelector('.selected-icon').classList.remove('not-selected');
            };
        });
        
        // 绑定遮罩点击关闭事件
        mask.onclick = (e) => {
            if (e.target === mask) {
                mask.style.display = 'none';
            }
        };
    }

    /**
     * 确认期权费用类型选择
     */
    confirmOptionFeeTypeSelection() {
        const mask = document.getElementById('optionFeeTypeMask');
        const selectedOption = mask.querySelector('.form-option .selected-icon:not(.not-selected)');
        
        if (selectedOption) {
            const optionElement = selectedOption.closest('.form-option');
            const value = optionElement.dataset.value;
            const text = optionElement.querySelector('.option-label').textContent;
            
            // 更新输入框显示和存储实际值
            const inputField = document.getElementById('optionFeeType');
            inputField.value = text;
            inputField.dataset.value = value;
        }
        
        // 隐藏弹窗
        mask.style.display = 'none';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.editProductPage = new EditProductPage();
});
