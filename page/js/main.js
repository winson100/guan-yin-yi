/**
 * 存贷组合产品测算器 - 主页面逻辑
 */

class MainPage {
    constructor() {
        this.currentDeleteId = null;
        this.currentClearGroup = null;
        this.init();
    }

    /**
     * 初始化页面
     */
    async init() {
        try {
            // 初始化数据库
            await window.productDB.init();
            
            // 绑定事件
            this.bindEvents();
            
            // 加载产品列表
            await this.loadProductList();
            
            // 监听页面可见性变化，当从其他页面返回时重新加载数据
            this.bindVisibilityChangeEvent();
            
        } catch (error) {
            console.error('页面初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
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

        // 产品组1按钮
        document.getElementById('addProductGroup1EmptyBtn').addEventListener('click', () => {
            this.goToAddProduct('group1');
        });
        document.getElementById('addProductGroup1Btn').addEventListener('click', () => {
            this.goToAddProduct('group1');
        });
        document.getElementById('clearGroup1Btn').addEventListener('click', () => {
            this.clearGroup('group1');
        });
        document.getElementById('summaryGroup1Btn').addEventListener('click', () => {
            this.goToSummary('group1');
        });

        // 产品组2按钮
        document.getElementById('addProductGroup2EmptyBtn').addEventListener('click', () => {
            this.goToAddProduct('group2');
        });
        document.getElementById('addProductGroup2Btn').addEventListener('click', () => {
            this.goToAddProduct('group2');
        });
        document.getElementById('clearGroup2Btn').addEventListener('click', () => {
            this.clearGroup('group2');
        });
        document.getElementById('summaryGroup2Btn').addEventListener('click', () => {
            this.goToSummary('group2');
        });

        // 产品组合比较按钮
        document.getElementById('compareBtn').addEventListener('click', () => {
            this.goToCompare();
        });

        // 删除确认弹窗
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.hideDeleteDialog();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });

        // 清空产品组确认弹窗
        document.getElementById('cancelClearGroupBtn').addEventListener('click', () => {
            this.hideClearGroupDialog();
        });

        document.getElementById('confirmClearGroupBtn').addEventListener('click', () => {
            this.confirmClearGroup();
        });

        // 帮助弹窗（保留，因为HTML中还有帮助弹窗）
        document.getElementById('closeHelpBtn').addEventListener('click', () => {
            this.hideHelp();
        });

        // 公告点击事件
        document.getElementById('announcementTip').addEventListener('click', () => {
            this.goToQuoteDetails();
        });
    }

    /**
     * 加载产品列表
     */
    async loadProductList() {
        try {
            console.log('开始加载产品列表...');
            
            // 获取产品数据
            const products = await window.productDB.getAllProducts();
            console.log('获取到的所有产品:', products);
            
            // 按组分组产品
            const group1Products = products.filter(product => (product.group || 'group1') === 'group1');
            const group2Products = products.filter(product => product.group === 'group2');
            
            console.log('产品组1:', group1Products.length, '个产品');
            console.log('产品组2:', group2Products.length, '个产品');
            
            // 加载产品组1
            await this.loadProductGroup('group1', group1Products);
            
            // 加载产品组2
            await this.loadProductGroup('group2', group2Products);
            
            // 统一绑定产品项事件
            this.bindProductEvents();

            console.log('产品列表加载完成');

        } catch (error) {
            console.error('加载产品列表失败:', error);
            this.showError('加载产品列表失败');
        }
    }

    /**
     * 绑定页面可见性变化事件
     */
    bindVisibilityChangeEvent() {
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('页面变为可见，重新加载产品列表');
                this.loadProductList();
            }
        });

        // 监听页面焦点变化（备用方案）
        window.addEventListener('focus', () => {
            console.log('页面获得焦点，重新加载产品列表');
            this.loadProductList();
        });
    }

    /**
     * 加载指定组的产品列表
     */
    async loadProductGroup(groupId, products) {
        try {
            const productList = document.getElementById(`${groupId}ProductList`);
            const emptyState = document.getElementById(`${groupId}EmptyState`);
            const groupActions = document.getElementById(`${groupId}Actions`);
            const groupCount = document.getElementById(`${groupId}Count`);

            // 显示加载状态
            productList.innerHTML = '<div class="loading">加载中...</div>';

            // 更新产品数量
            groupCount.textContent = `共 ${products.length} 个产品`;

            if (products.length === 0) {
                // 显示空状态，隐藏操作按钮
                productList.style.display = 'none';
                emptyState.style.display = 'block';
                groupActions.style.display = 'none';
                return;
            }

            // 隐藏空状态，显示操作按钮
            emptyState.style.display = 'none';
            productList.style.display = 'block';
            groupActions.style.display = 'flex';

            // 渲染产品列表
            productList.innerHTML = products.map(product => this.renderProductItem(product)).join('');

        } catch (error) {
            console.error(`加载${groupId}产品列表失败:`, error);
            this.showError(`加载${groupId}产品列表失败`);
        }
    }

    /**
     * 渲染产品项
     */
    renderProductItem(product) {
        const typeText = this.getProductTypeText(product.type);
        const typeClass = this.getProductTypeClass(product.type, product);
        const income = this.getProductIncome(product);
        const details = this.getProductDetails(product);

        // 处理产品名称显示：如果没有名称或者是远期/掉期/期权相关名称，只显示产品类型标签
        const productNameDisplay = product.name && product.name.trim() && 
            product.name !== '远期' && product.name !== '掉期' && product.name !== '期权' &&
            product.name !== 'forward' && product.name !== 'swap' && product.name !== 'option' ? 
            `<div class="product-name">${product.name}</div>` : 
            '';

        return `
            <div class="product-item" data-id="${product.id}">
                <!-- 默认状态：一行显示 -->
                <div class="product-row">
                    <div class="product-info-group">
                        ${productNameDisplay}
                        <div class="product-type ${typeClass}">${typeText}</div>
                    </div>
                    <div class="product-income">
                        <div class="income-amount ${this.getIncomeClass(income)}">${this.formatIncomeWithSign(income, product)}</div>
                    </div>
                    <div class="product-expand">
                        <img src="../src/assets/icons/arrow-down.svg" alt="展开" class="expand-icon" data-action="expand" data-id="${product.id}">
                    </div>
                </div>
                
                <!-- 展开状态：详细信息 -->
                <div class="product-details" id="details-${product.id}">
                    <div class="detail-grid">
                        ${details}
                    </div>
                    <div class="product-actions">
                        <button class="action-btn danger" data-action="delete" data-id="${product.id}">删除</button>
                        <button class="action-btn" data-action="edit" data-id="${product.id}">编辑</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 获取产品类型文本
     */
    getProductTypeText(type) {
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
        return typeMap[type] || '未知';
    }

    /**
     * 获取产品类型样式类
     */
    getProductTypeClass(type, product = null) {
        if (type === 'spot' || type === 'foreign_spot') {
            return 'foreign'; // 即期使用蓝色
        } else if (type === 'foreign_forward') {
            return 'forward'; // 远期使用紫色
        } else if (type === 'foreign_swap') {
            return 'swap'; // 掉期使用深粉色
        } else if (type === 'foreign_option') {
            return 'option'; // 期权使用橙色
        } else if (type === 'derivative') {
            // 衍生品需要根据产品名称判断
            if (product && product.name) {
                if (product.name === 'forward' || product.name === '远期') {
                    return 'forward'; // 远期使用紫色
                } else if (product.name === 'swap' || product.name === '掉期') {
                    return 'swap'; // 掉期使用深粉色
                } else if (product.name === 'option' || product.name === '期权') {
                    return 'option'; // 期权使用橙色
                }
            }
            return 'derivative'; // 默认使用衍生品类型
        }
        return type;
    }

    /**
     * 获取产品收益
     */
    getProductIncome(product) {
        switch (product.type) {
            case 'deposit':
                // 存款收益 = 利息
                return product.interest || 0;
            case 'loan':
                // 贷款收益 = -利息，贷款是支出（不包含手续费）
                return -(product.interest || 0);
            case 'credit':
                // 信用证收益 = 0，不计算手续费
                return 0;
            case 'spot':
            case 'foreign_spot':
                // 即期交易通常没有直接收益
                return 0;
            case 'derivative':
            case 'foreign_swap':
                // 衍生/掉期收益 = 期末收益（不包含手续费）
                return product.finalIncome || 0;
            case 'foreign_forward':
                // 远期交易通常没有直接收益
                return 0;
            case 'foreign_option':
                // 期权收益 = 期权费（收入为正，支出为负）
                const optionFeeAmount = product.optionFeeAmount || 0;
                return product.optionFeeType === 'income' ? optionFeeAmount : -optionFeeAmount;
            default:
                return 0;
        }
    }

    /**
     * 获取收益样式类
     */
    getIncomeClass(income) {
        const amount = parseFloat(income);
        if (amount > 0) {
            return 'positive';
        } else if (amount < 0) {
            return 'negative';
        }
        return '';
    }

    /**
     * 获取产品币种
     */
    getProductCurrency(product) {
        switch (product.type) {
            case 'deposit':
            case 'loan':
            case 'credit':
                return product.currency || 'CNY';
            case 'spot':
            case 'foreign_spot':
            case 'foreign_forward':
                return product.buyCurrency || 'CNY';
            case 'derivative':
            case 'foreign_swap':
                // 衍生/掉期交易通常以近端买入币种作为收益币种
                return product.nearBuyCurrency || 'CNY';
            default:
                return 'CNY';
        }
    }

    /**
     * 格式化收益金额并添加符号和币种
     */
    formatIncomeWithSign(income, product) {
        const amount = parseFloat(income);
        const formattedAmount = this.formatAmount(Math.abs(amount));
        const currency = this.getProductCurrency(product);
        
        if (amount > 0) {
            return `+${formattedAmount} ${currency}`;
        } else if (amount < 0) {
            return `-${formattedAmount} ${currency}`;
        }
        return `${formattedAmount} ${currency}`;
    }

    /**
     * 获取产品详情
     */
    getProductDetails(product) {
        let details = '';

        switch (product.type) {
            case 'deposit':
                details = `
                    <div class="detail-item">
                        <div class="detail-label">币种</div>
                        <div class="detail-value">${product.currency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">金额</div>
                        <div class="detail-value">${this.formatAmount(product.amount)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">利率</div>
                        <div class="detail-value">${product.rate}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">期限</div>
                        <div class="detail-value">${this.formatPeriodDisplay(product.period, product.periodUnit)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">利息</div>
                        <div class="detail-value">${this.formatAmount(product.interest)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">本息</div>
                        <div class="detail-value">${this.formatAmount(product.principal)}</div>
                    </div>
                `;
                break;

            case 'loan':
                details = `
                    <div class="detail-item">
                        <div class="detail-label">币种</div>
                        <div class="detail-value">${product.currency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">金额</div>
                        <div class="detail-value">${this.formatAmount(product.amount)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">利率</div>
                        <div class="detail-value">${product.rate}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">期限</div>
                        <div class="detail-value">${this.formatPeriodDisplay(product.period, product.periodUnit)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">利息</div>
                        <div class="detail-value">${this.formatAmount(product.interest)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">手续费金额</div>
                        <div class="detail-value">${this.formatAmount(product.feeAmount)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">本息</div>
                        <div class="detail-value">${this.formatAmount(product.principal)}</div>
                    </div>
                `;
                break;

            case 'credit':
                details = `
                    <div class="detail-item">
                        <div class="detail-label">币种</div>
                        <div class="detail-value">${product.currency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">金额</div>
                        <div class="detail-value">${this.formatAmount(product.amount)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">有效期</div>
                        <div class="detail-value">${product.expiryDate || ''}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">手续费金额</div>
                        <div class="detail-value">${this.formatAmount(product.feeAmount)}</div>
                    </div>
                `;
                break;

            case 'foreign_spot':
            case 'spot':
            case 'foreign_forward':
                details = `
                    <div class="detail-item">
                        <div class="detail-label">卖出币种</div>
                        <div class="detail-value">${product.sellCurrency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">买入币种</div>
                        <div class="detail-value">${product.buyCurrency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">卖出金额</div>
                        <div class="detail-value">${this.formatAmount(product.sellAmount)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">汇率</div>
                        <div class="detail-value">${product.exchangeRate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">买入金额</div>
                        <div class="detail-value">${this.formatAmount(product.buyAmount)}</div>
                    </div>
                `;
                break;

            case 'foreign_swap':
                details = `
                    <div class="detail-item">
                        <div class="detail-label">近端卖出币种</div>
                        <div class="detail-value">${product.nearSellCurrency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">近端买入币种</div>
                        <div class="detail-value">${product.nearBuyCurrency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">近端卖出金额</div>
                        <div class="detail-value">${this.formatAmount(product.nearSellAmount)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">近端汇率</div>
                        <div class="detail-value">${product.nearRate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">远端卖出币种</div>
                        <div class="detail-value">${product.farSellCurrency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">远端买入币种</div>
                        <div class="detail-value">${product.farBuyCurrency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">远端汇率</div>
                        <div class="detail-value">${product.farRate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">期末收益</div>
                        <div class="detail-value">${this.formatAmount(product.finalIncome)}</div>
                    </div>
                `;
                break;

            case 'foreign_option':
                details = `
                    <div class="detail-item">
                        <div class="detail-label">期权费用类型</div>
                        <div class="detail-value">${product.optionFeeType === 'income' ? '收入' : '支出'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">期权费CNY</div>
                        <div class="detail-value">${this.formatAmount(product.optionFeeAmount)}</div>
                    </div>
                `;
                break;
        }


        return details;
    }

    /**
     * 绑定产品项事件
     */
    bindProductEvents() {
        // 产品行点击展开/收起
        document.querySelectorAll('.product-row').forEach(row => {
            row.addEventListener('click', (e) => {
                // 如果点击的是展开图标，不重复触发
                if (e.target.closest('[data-action="expand"]')) {
                    return;
                }
                const productId = row.closest('.product-item').dataset.id;
                this.toggleProductDetails(productId);
            });
        });

        // 展开/收起按钮
        document.querySelectorAll('[data-action="expand"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                const productId = e.target.dataset.id;
                this.toggleProductDetails(productId);
            });
        });

        // 编辑按钮
        document.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                const productId = e.target.dataset.id;
                this.editProduct(productId);
            });
        });

        // 删除按钮
        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                const productId = e.target.dataset.id;
                this.showDeleteDialog(productId);
            });
        });
    }

    /**
     * 切换产品详情显示
     */
    toggleProductDetails(productId) {
        const detailsElement = document.getElementById(`details-${productId}`);
        const expandIcon = document.querySelector(`[data-action="expand"][data-id="${productId}"]`);
        const productItem = document.querySelector(`[data-id="${productId}"]`);
        
        if (detailsElement.classList.contains('show')) {
            detailsElement.classList.remove('show');
            productItem.classList.remove('expanded');
            expandIcon.style.transform = 'rotate(0deg)';
        } else {
            detailsElement.classList.add('show');
            productItem.classList.add('expanded');
            expandIcon.style.transform = 'rotate(180deg)';
        }
    }

    /**
     * 编辑产品
     */
    async editProduct(productId) {
        try {
            // 获取产品信息以确定组
            const product = await window.productDB.getProductById(productId);
            const group = product.group || 'group1';
            
            // 跳转到编辑页面，传递组参数
            window.location.href = `edit-product.html?id=${productId}&group=${group}`;
        } catch (error) {
            console.error('获取产品信息失败:', error);
            // 如果获取失败，使用默认组
            window.location.href = `edit-product.html?id=${productId}&group=group1`;
        }
    }

    /**
     * 删除产品
     */
    async deleteProduct(productId) {
        try {
            await window.productDB.deleteProduct(parseInt(productId));
            this.showSuccess('产品删除成功');
            await this.loadProductList();
        } catch (error) {
            console.error('删除产品失败:', error);
            this.showError('删除产品失败');
        }
    }

    /**
     * 显示删除确认弹窗
     */
    showDeleteDialog(productId) {
        this.currentDeleteId = productId;
        document.getElementById('deleteMask').style.display = 'flex';
    }

    /**
     * 隐藏删除确认弹窗
     */
    hideDeleteDialog() {
        document.getElementById('deleteMask').style.display = 'none';
        this.currentDeleteId = null;
    }

    /**
     * 确认删除
     */
    async confirmDelete() {
        if (this.currentDeleteId) {
            await this.deleteProduct(this.currentDeleteId);
            this.hideDeleteDialog();
        }
    }

    /**
     * 跳转到首页
     */
    async goHome() {
        try {
            // 清理 IndexedDB 中的所有产品数据
            await window.productDB.clearAllProducts();
            console.log('所有产品数据已清理');
        } catch (error) {
            console.error('清理数据失败:', error);
        }
        
        // 刷新页面（如果当前页面就是 index.html，则刷新；否则跳转到 index.html）
        if (window.location.pathname.includes('index.html')) {
            window.location.reload();
        } else {
            window.location.href = 'index.html';
        }
    }

    /**
     * 显示帮助
     */
    showHelp() {
        document.getElementById('helpMask').style.display = 'flex';
    }

    /**
     * 隐藏帮助
     */
    hideHelp() {
        document.getElementById('helpMask').style.display = 'none';
    }

    /**
     * 跳转到添加产品页面
     */
    goToAddProduct() {
        window.location.href = 'add-product_v2.html';
    }

    /**
     * 跳转到汇总收益页面
     */
    goToSummary() {
        window.location.href = 'summary.html';
    }

    /**
     * 跳转到报价详情页面
     */
    goToQuoteDetails() {
        window.location.href = 'quote-details.html';
    }

    /**
     * 返回上一页
     */
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // 如果没有历史记录，跳转到首页或其他页面
            window.location.href = '../src/components/iphone-preview.html';
        }
    }

    /**
     * 格式化金额
     */
    formatAmount(amount) {
        if (amount === null || amount === undefined) {
            return '0.00';
        }
        return parseFloat(amount).toFixed(2);
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
        return unitMap[unit] || '年'; // 默认为年
    }

    /**
     * 格式化期限显示
     */
    formatPeriodDisplay(period, periodUnit) {
        const unit = this.getPeriodUnitDisplayText(periodUnit);
        return `${period}${unit}`;
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
            
            // 3秒后自动移除
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 3000);
        } else {
            // 备用方案：如果找不到主容器，就添加到body
            document.body.appendChild(messageElement);
            
            // 3秒后自动移除
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 3000);
        }
    }

    /**
     * 跳转到添加产品页面（带组参数）
     */
    goToAddProduct(group = 'group1') {
        window.location.href = `add-product_v2.html?group=${group}`;
    }

    /**
     * 跳转到汇总收益页面（带组参数）
     */
    goToSummary(group = 'group1') {
        window.location.href = `summary.html?group=${group}`;
    }

    /**
     * 清空指定组的所有产品
     */
    async clearGroup(group) {
        try {
            const products = await window.productDB.getAllProducts();
            const groupProducts = products.filter(product => (product.group || 'group1') === group);
            
            if (groupProducts.length === 0) {
                this.showMessage(`${group === 'group1' ? '产品组1' : '产品组2'}暂无产品`, 'info');
                return;
            }

            // 显示确认弹层
            this.showClearGroupDialog(group);

        } catch (error) {
            console.error('清空产品组失败:', error);
            this.showError('清空产品组失败');
        }
    }

    /**
     * 显示清空产品组确认弹层
     */
    showClearGroupDialog(group) {
        this.currentClearGroup = group;
        const groupName = group === 'group1' ? '产品组1' : '产品组2';
        document.getElementById('clearGroupContent').textContent = `确定要清空${groupName}的所有产品吗？此操作不可恢复。`;
        document.getElementById('clearGroupMask').style.display = 'flex';
    }

    /**
     * 确认清空产品组
     */
    async confirmClearGroup() {
        try {
            const group = this.currentClearGroup;
            const products = await window.productDB.getAllProducts();
            const groupProducts = products.filter(product => (product.group || 'group1') === group);

            // 删除组内所有产品
            for (const product of groupProducts) {
                await window.productDB.deleteProduct(product.id);
            }

            this.showMessage(`已清空${group === 'group1' ? '产品组1' : '产品组2'}的所有产品`, 'success');
            
            // 隐藏弹层
            this.hideClearGroupDialog();
            
            // 重新加载产品列表
            await this.loadProductList();

        } catch (error) {
            console.error('清空产品组失败:', error);
            this.showError('清空产品组失败');
        }
    }

    /**
     * 隐藏清空产品组确认弹层
     */
    hideClearGroupDialog() {
        document.getElementById('clearGroupMask').style.display = 'none';
        this.currentClearGroup = null;
    }

    /**
     * 跳转到产品组合比较页面
     */
    goToCompare() {
        window.location.href = 'product-compare.html';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new MainPage();
});
