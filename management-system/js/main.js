/**
 * 后台管理系统主逻辑
 */

new Vue({
    el: '#app',
    data: {
        // 当前页面
        currentPage: 'calculator-settings',
        activeMenu: 'calculator-settings',
        
        // 查询表单
        searchForm: {
            status: ''
        },
        
        // 表格数据
        tableData: [],
        loading: false,
        selectedRows: [],
        
        // 分页
        pagination: {
            currentPage: 1,
            pageSize: 10,
            total: 0
        }
    },
    
    async mounted() {
        try {
            // 初始化服务
            await window.calculatorService.init();
            
            // 加载数据
            await this.loadData();
            
            this.$message.success('系统初始化成功');
        } catch (error) {
            console.error('系统初始化失败:', error);
            this.$message.error('系统初始化失败: ' + error.message);
        }
    },
    
    methods: {
        /**
         * 菜单选择
         */
        handleMenuSelect(index) {
            this.activeMenu = index;
            this.currentPage = index;
        },
        
        /**
         * 加载数据
         */
        async loadData() {
            this.loading = true;
            try {
                console.log('开始加载主页面数据...');
                const data = await window.calculatorService.getCalculatorSettings(this.searchForm);
                console.log('加载到的数据:', data);
                this.tableData = data;
                this.pagination.total = data.length;
                console.log(`数据加载完成，共 ${data.length} 条记录`);
            } catch (error) {
                console.error('加载数据失败:', error);
                this.$message.error('加载数据失败: ' + error.message);
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * 搜索数据
         */
        async searchData() {
            this.pagination.currentPage = 1;
            await this.loadData();
        },
        
        /**
         * 重置搜索
         */
        resetSearch() {
            this.searchForm = {
                status: ''
            };
            this.searchData();
        },
        
        /**
         * 表格选择变化
         */
        handleSelectionChange(selection) {
            this.selectedRows = selection;
        },
        
        /**
         * 分页大小变化
         */
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.pagination.currentPage = 1;
            this.loadData();
        },
        
        /**
         * 当前页变化
         */
        handleCurrentChange(val) {
            this.pagination.currentPage = val;
            this.loadData();
        },
        
        /**
         * 跳转到新增页面
         */
        goToAddPage() {
            window.location.href = 'add.html';
        },
        
        /**
         * 编辑项目
         */
        editItem(row) {
            console.log('编辑项目:', row);
            console.log('项目ID:', row.id, '类型:', typeof row.id);
            window.location.href = `edit.html?id=${row.id}`;
        },
        
        /**
         * 删除项目
         */
        async deleteItem(row) {
            try {
                // 检查状态
                if (row.status === 'inactive') {
                    this.$message.warning('只能对状态为【生效】的记录执行删除操作，请重新选择！');
                    return;
                }
                
                // 确认删除
                await this.$confirm('确定要删除这条记录吗？', '删除确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                // 执行删除
                await window.calculatorService.deleteCalculatorSetting(row.id);
                this.$message.success('删除成功');
                
                // 重新加载数据
                await this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('删除失败:', error);
                    this.$message.error('删除失败: ' + error.message);
                }
            }
        },
        
        /**
         * 批量删除
         */
        async batchDelete() {
            if (this.selectedRows.length === 0) {
                this.$message.warning('请先选择要删除的记录');
                return;
            }
            
            // 检查是否有失效状态的记录
            const inactiveRows = this.selectedRows.filter(row => row.status === 'inactive');
            if (inactiveRows.length > 0) {
                this.$message.warning('只能对状态为【生效】的记录执行删除操作，请重新选择！');
                return;
            }
            
            try {
                await this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 条记录吗？`, '批量删除确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                // 执行批量删除
                for (const row of this.selectedRows) {
                    await window.calculatorService.deleteCalculatorSetting(row.id);
                }
                
                this.$message.success(`成功删除 ${this.selectedRows.length} 条记录`);
                
                // 重新加载数据
                await this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('批量删除失败:', error);
                    this.$message.error('批量删除失败: ' + error.message);
                }
            }
        },
        
        /**
         * 导出数据
         */
        async exportData() {
            try {
                this.$message.info('正在导出数据...');
                await window.calculatorService.exportData();
                this.$message.success('数据导出成功');
            } catch (error) {
                console.error('导出数据失败:', error);
                this.$message.error('导出数据失败: ' + error.message);
            }
        },
        
        /**
         * 导入数据
         */
        importData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                try {
                    await this.$confirm('导入数据将覆盖现有数据，确定要继续吗？', '导入确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    });
                    
                    this.$message.info('正在导入数据...');
                    await window.calculatorService.importData(file);
                    this.$message.success('数据导入成功');
                    
                    // 重新加载数据
                    await this.loadData();
                } catch (error) {
                    if (error !== 'cancel') {
                        console.error('导入数据失败:', error);
                        this.$message.error('导入数据失败: ' + error.message);
                    }
                }
            };
            input.click();
        },
        
        /**
         * 退出登录
         */
        logout() {
            this.$confirm('确定要退出登录吗？', '退出确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 这里可以添加退出登录的逻辑
                this.$message.success('已退出登录');
                // 可以跳转到登录页面
                // window.location.href = 'login.html';
            }).catch(() => {
                // 取消退出
            });
        }
    }
});
