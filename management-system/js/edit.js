/**
 * 修改页面逻辑
 */

// 创建Vue实例
const vueInstance = new Vue({
    el: '#app',
    data: {
        // 记录ID
        recordId: null,
        
        // 原始数据
        formData: null,
        
        // 表单数据
        form: {
            title: '',
            maintainer: ''
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
        loading: true,
        uploadAction: '#', // 不使用真实的上传地址
        isSaved: false // 标记是否已保存
    },
    
    async mounted() {
        try {
            // 获取记录ID
            this.recordId = this.getRecordIdFromUrl();
            if (!this.recordId) {
                this.$message.error('缺少记录ID参数');
                this.goBack();
                return;
            }
            
            // 初始化服务
            await window.calculatorService.init();
            
            // 加载数据
            await this.loadData();
            
            // 初始化内容编辑器
            this.initContentEditor();
            
        } catch (error) {
            console.error('页面初始化失败:', error);
            this.$message.error('页面初始化失败: ' + error.message);
            this.loading = false;
        }
    },
    
    methods: {
        /**
         * 从URL获取记录ID
         */
        getRecordIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            // 将字符串ID转换为数字，因为IndexedDB使用自增数字ID
            return id ? parseInt(id, 10) : null;
        },
        
        /**
         * 加载数据
         */
        async loadData() {
            try {
                this.loading = true;
                console.log('开始加载记录数据，ID:', this.recordId, '类型:', typeof this.recordId);

                // 获取记录数据
                this.formData = await window.calculatorService.getCalculatorSettingById(this.recordId);
                console.log('获取到的记录数据:', this.formData);

                if (!this.formData) {
                    console.error('未找到记录，ID:', this.recordId);
                    this.$message.error('记录不存在或已被删除');
                    this.loading = false;
                    return;
                }
                
                // 填充表单数据
                this.form = {
                    title: this.formData.title || '',
                    maintainer: this.formData.maintainer || '系统管理员'
                };
                
                // 设置内容块数据
                if (this.formData.contentBlocks && this.formData.contentBlocks.length > 0) {
                    window.contentEditor.setContentData(this.formData.contentBlocks);
                } else {
                    // 兼容旧数据格式
                    if (this.formData.content) {
                        // 将旧的内容转换为新的格式
                        const textBlock = {
                            id: window.contentEditor.generateBlockId(),
                            type: 'text',
                            content: this.formData.content,
                            order: 0
                        };
                        window.contentEditor.setContentData([textBlock]);
                    }
                }
                
                // 格式化时间
                this.formData.createTimeFormatted = window.calculatorService.formatDateTime(this.formData.createTime);
                this.formData.updateTimeFormatted = window.calculatorService.formatDateTime(this.formData.updateTime);
                
                this.loading = false;
                
            } catch (error) {
                console.error('加载数据失败:', error);
                this.$message.error('加载数据失败: ' + error.message);
                this.loading = false;
            }
        },
        
        /**
         * 初始化内容编辑器
         */
        initContentEditor() {
            // 同步内容块数据
            this.contentBlocks = window.contentEditor.contentBlocks;
            this.activeBlockIndex = window.contentEditor.activeBlockIndex;
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
            this.contentBlocks = [...window.contentEditor.contentBlocks];
            this.activeBlockIndex = window.contentEditor.activeBlockIndex;
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
                
                // 检查内容块
                const validation = window.contentEditor.validateContent();
                if (!validation.isValid) {
                    this.$message.warning(validation.errors.join('；'));
                    return;
                }
                
                this.saving = true;
                
                // 准备保存数据
                const saveData = {
                    title: this.form.title.trim(),
                    maintainer: this.form.maintainer.trim(),
                    contentBlocks: window.contentEditor.getContentData()
                };
                
                // 保存数据
                const result = await window.calculatorService.updateCalculatorSetting(this.recordId, saveData);
                
                // 保存成功后设置保存标志
                this.isSaved = true;
                
                this.$message.success('保存成功');
                
                // 直接跳转回列表页，不延迟
                window.location.href = 'index.html';
                
            } catch (error) {
                console.error('保存失败:', error);
                this.$message.error('保存失败: ' + error.message);
            } finally {
                this.saving = false;
            }
        },
        
        /**
         * 重置表单
         */
        resetForm() {
            this.$confirm('确定要重置表单吗？所有修改将被撤销。', '重置确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 恢复到原始数据
                this.form = {
                    title: this.formData.title || '',
                    maintainer: this.formData.maintainer || '系统管理员'
                };
                
                // 恢复内容块数据
                if (this.formData.contentBlocks && this.formData.contentBlocks.length > 0) {
                    window.contentEditor.setContentData(this.formData.contentBlocks);
                } else {
                    // 兼容旧数据格式
                    if (this.formData.content) {
                        const textBlock = {
                            id: window.contentEditor.generateBlockId(),
                            type: 'text',
                            content: this.formData.content,
                            order: 0
                        };
                        window.contentEditor.setContentData([textBlock]);
                    }
                }
                
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
                this.$confirm('当前有未保存的修改，确定要离开吗？', '离开确认', {
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
            
            if (!this.formData) return false;
            
            // 检查标题
            if (this.form.title.trim() !== (this.formData.title || '')) {
                return true;
            }
            
            // 检查维护人
            if (this.form.maintainer.trim() !== (this.formData.maintainer || '')) {
                return true;
            }
            
            // 检查内容块
            const currentContentBlocks = window.contentEditor.getContentData();
            const originalContentBlocks = this.formData.contentBlocks || [];
            
            if (JSON.stringify(currentContentBlocks) !== JSON.stringify(originalContentBlocks)) {
                return true;
            }
            
            return false;
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
        e.returnValue = '当前有未保存的修改，确定要离开吗？';
    }
});
