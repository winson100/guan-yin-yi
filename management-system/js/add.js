/**
 * 新增页面逻辑
 */

// 创建Vue实例
const vueInstance = new Vue({
    el: '#app',
    data: {
        // 表单数据
        form: {
            title: '',
            maintainer: '系统管理员'
        },
        
        // 内容块数据
        contentBlocks: [],
        activeBlockIndex: -1,
        
        // 表单验证规则
        rules: {
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' },
                { min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur' }
            ],
            maintainer: [
                { required: true, message: '请输入维护人', trigger: 'blur' },
                { min: 1, max: 50, message: '维护人长度在 1 到 50 个字符', trigger: 'blur' }
            ]
        },
        
        // 上传相关
        saving: false,
        uploadAction: '#', // 不使用真实的上传地址
        isSaved: false // 标记是否已保存
    },
    
    async mounted() {
        try {
            console.log('开始页面初始化...');
            
            // 检查依赖是否加载
            if (!window.databaseService) {
                throw new Error('数据库服务未加载');
            }
            if (!window.calculatorService) {
                throw new Error('计算器服务未加载');
            }
            if (!window.contentEditor) {
                throw new Error('内容编辑器未加载');
            }
            
            console.log('所有依赖已加载');
            
            // 初始化服务
            await window.calculatorService.init();
            
            // 初始化内容编辑器
            this.initContentEditor();
            
            this.$message.success('页面初始化成功');
        } catch (error) {
            console.error('页面初始化失败:', error);
            this.$message.error('页面初始化失败: ' + error.message);
        }
    },
    
    methods: {
        /**
         * 初始化内容编辑器
         */
        initContentEditor() {
            // 确保内容编辑器已加载
            if (window.contentEditor) {
                // 同步内容块数据
                this.contentBlocks = window.contentEditor.contentBlocks;
                this.activeBlockIndex = window.contentEditor.activeBlockIndex;
                console.log('内容编辑器初始化成功');
            } else {
                console.error('内容编辑器未加载');
                this.$message.error('内容编辑器加载失败');
            }
        },
        
        /**
         * 添加文字块
         */
        addTextBlock() {
            window.contentEditor.addTextBlock();
            this.syncContentBlocks();
        },
        
        /**
         * 添加图片块
         */
        addImageBlock() {
            window.contentEditor.addImageBlock();
            this.syncContentBlocks();
        },
        
        /**
         * 设置活动块
         */
        setActiveBlock(index) {
            window.contentEditor.setActiveBlock(index);
            this.activeBlockIndex = index;
        },
        
        /**
         * 删除块
         */
        removeBlock(index) {
            this.$confirm('确定要删除这个内容块吗？', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                window.contentEditor.removeBlock(index);
                this.syncContentBlocks();
                this.$message.success('内容块删除成功');
            }).catch(() => {
                // 取消删除
            });
        },
        
        /**
         * 向上移动块
         */
        moveBlockUp(index) {
            window.contentEditor.moveBlockUp(index);
            this.syncContentBlocks();
        },
        
        /**
         * 向下移动块
         */
        moveBlockDown(index) {
            window.contentEditor.moveBlockDown(index);
            this.syncContentBlocks();
        },
        
        /**
         * 同步内容块数据
         */
        syncContentBlocks() {
            if (window.contentEditor) {
                this.contentBlocks = [...window.contentEditor.contentBlocks];
                this.activeBlockIndex = window.contentEditor.activeBlockIndex;
                console.log('同步内容块数据:', this.contentBlocks);
            } else {
                console.error('内容编辑器未初始化，无法同步数据');
            }
        },
        
        /**
         * 图片上传前验证
         */
        beforeImageUpload(file, blockIndex) {
            const isImage = file.type.startsWith('image/');
            const isLt5M = file.size / 1024 / 1024 < 5;
            
            if (!isImage) {
                this.$message.error('只能上传图片文件!');
                return false;
            }
            if (!isLt5M) {
                this.$message.error('图片大小不能超过 5MB!');
                return false;
            }
            
            // 阻止默认上传行为，使用自定义上传
            this.handleImageUpload(file, blockIndex);
            return false;
        },
        
        /**
         * 处理图片上传
         */
        async handleImageUpload(file, blockIndex) {
            try {
                this.$message.info('正在上传图片...');
                const result = await window.calculatorService.uploadImage(file);
                
                // 设置图片数据到对应的块
                window.contentEditor.setImageData(blockIndex, result);
                this.syncContentBlocks();
                
                this.$message.success('图片上传成功');
            } catch (error) {
                console.error('图片上传失败:', error);
                this.$message.error('图片上传失败: ' + error.message);
            }
        },
        
        /**
         * 图片上传成功
         */
        handleImageSuccess(response, file, blockIndex) {
            // 这里不会执行，因为我们阻止了默认上传
        },
        
        /**
         * 图片上传失败
         */
        handleImageError(error, file, blockIndex) {
            this.$message.error('图片上传失败');
        },
        
        /**
         * 更换图片
         */
        changeImage(blockIndex) {
            // 创建文件输入元素
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleImageUpload(file, blockIndex);
                }
            };
            input.click();
        },
        
        /**
         * 保存表单
         */
        async saveForm() {
            try {
                // 表单验证
                const valid = await this.$refs.form.validate();
                if (!valid) {
                    return;
                }
                
                // 检查内容编辑器是否初始化
                if (!window.contentEditor) {
                    this.$message.error('内容编辑器未初始化');
                    return;
                }
                
                // 检查内容块
                const validation = window.contentEditor.validateContent();
                if (!validation.isValid) {
                    this.$message.warning(validation.errors.join('；'));
                    return;
                }
                
                this.saving = true;
                
                // 准备保存数据
                const contentBlocks = window.contentEditor.getContentData();
                console.log('准备保存的内容块:', contentBlocks);
                
                const saveData = {
                    title: this.form.title.trim(),
                    maintainer: this.form.maintainer.trim(),
                    contentBlocks: contentBlocks
                };
                
                console.log('准备保存的数据:', saveData);
                
                // 保存数据
                const result = await window.calculatorService.addCalculatorSetting(saveData);
                console.log('保存结果:', result);
                
                // 保存成功后设置保存标志
                this.isSaved = true;
                
                this.$message.success('保存成功');
                
                // 直接跳转回列表页，不延迟
                window.location.href = 'index.html';
                
            } catch (error) {
                console.error('保存失败:', error);
                console.error('错误详情:', error);
                this.$message.error('保存失败: ' + (error.message || '未知错误'));
            } finally {
                this.saving = false;
            }
        },
        
        /**
         * 重置表单
         */
        resetForm() {
            this.$confirm('确定要重置表单吗？所有内容将被清空。', '重置确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form = {
                    title: '',
                    maintainer: '系统管理员'
                };
                
                window.contentEditor.clearContent();
                this.syncContentBlocks();
                
                this.$refs.form.clearValidate();
                this.$message.success('表单已重置');
            }).catch(() => {
                // 取消重置
            });
        },
        
        /**
         * 返回列表页
         */
        goBack() {
            // 检查是否有未保存的内容
            if (this.hasUnsavedChanges()) {
                this.$confirm('当前有未保存的内容，确定要离开吗？', '离开确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.location.href = 'index.html';
                }).catch(() => {
                    // 取消离开
                });
            } else {
                window.location.href = 'index.html';
            }
        },
        
        /**
         * 检查是否有未保存的更改
         */
        hasUnsavedChanges() {
            // 如果已经保存，则没有未保存的更改
            if (this.isSaved) {
                return false;
            }
            
            return this.form.title.trim() !== '' || 
                   window.contentEditor.hasContent();
        },
        
        /**
         * 清除未保存状态
         */
        clearUnsavedState() {
            // 清空表单数据
            this.form = {
                title: '',
                maintainer: '系统管理员'
            };
            
            // 清空内容编辑器
            if (window.contentEditor) {
                window.contentEditor.clearContent();
                this.syncContentBlocks();
            }
            
            // 清除表单验证状态
            if (this.$refs.form) {
                this.$refs.form.clearValidate();
            }
        }
    },
    
    // 页面离开前确认
    beforeDestroy() {
        // 清理资源
        if (window.contentEditor) {
            window.contentEditor.clearContent();
        }
    }
});

// 将Vue实例保存到全局变量，供beforeunload事件使用
window.vueInstance = vueInstance;

// 页面离开前确认
window.addEventListener('beforeunload', (e) => {
    // 检查Vue实例是否存在且未保存
    if (window.vueInstance && window.vueInstance.hasUnsavedChanges && window.vueInstance.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '当前有未保存的内容，确定要离开吗？';
    }
});
