/**
 * 内容编辑器功能
 * 支持多段文字和图片组合编辑
 */

class ContentEditor {
    constructor() {
        this.contentBlocks = [];
        this.activeBlockIndex = -1;
        this.blockIdCounter = 0;
    }

    /**
     * 添加文字块
     */
    addTextBlock() {
        const block = {
            id: this.generateBlockId(),
            type: 'text',
            content: '',
            order: this.contentBlocks.length
        };
        
        this.contentBlocks.push(block);
        this.setActiveBlock(this.contentBlocks.length - 1);
        return block;
    }

    /**
     * 添加图片块
     */
    addImageBlock() {
        const block = {
            id: this.generateBlockId(),
            type: 'image',
            imageData: null,
            order: this.contentBlocks.length
        };
        
        this.contentBlocks.push(block);
        this.setActiveBlock(this.contentBlocks.length - 1);
        return block;
    }

    /**
     * 删除块
     */
    removeBlock(index) {
        if (index >= 0 && index < this.contentBlocks.length) {
            this.contentBlocks.splice(index, 1);
            this.updateBlockOrders();
            
            // 调整活动块索引
            if (this.activeBlockIndex >= index) {
                this.activeBlockIndex = Math.max(0, this.activeBlockIndex - 1);
            }
        }
    }

    /**
     * 向上移动块
     */
    moveBlockUp(index) {
        if (index > 0) {
            const block = this.contentBlocks.splice(index, 1)[0];
            this.contentBlocks.splice(index - 1, 0, block);
            this.updateBlockOrders();
            
            if (this.activeBlockIndex === index) {
                this.activeBlockIndex = index - 1;
            }
        }
    }

    /**
     * 向下移动块
     */
    moveBlockDown(index) {
        if (index < this.contentBlocks.length - 1) {
            const block = this.contentBlocks.splice(index, 1)[0];
            this.contentBlocks.splice(index + 1, 0, block);
            this.updateBlockOrders();
            
            if (this.activeBlockIndex === index) {
                this.activeBlockIndex = index + 1;
            }
        }
    }

    /**
     * 设置活动块
     */
    setActiveBlock(index) {
        this.activeBlockIndex = index;
    }

    /**
     * 更新块顺序
     */
    updateBlockOrders() {
        this.contentBlocks.forEach((block, index) => {
            block.order = index;
        });
    }

    /**
     * 生成块ID
     */
    generateBlockId() {
        return `block_${Date.now()}_${++this.blockIdCounter}`;
    }

    /**
     * 设置图片数据
     */
    setImageData(blockIndex, imageData) {
        if (blockIndex >= 0 && blockIndex < this.contentBlocks.length) {
            const block = this.contentBlocks[blockIndex];
            if (block.type === 'image') {
                block.imageData = imageData;
            }
        }
    }

    /**
     * 获取内容数据
     */
    getContentData() {
        return this.contentBlocks.map(block => ({
            id: block.id,
            type: block.type,
            order: block.order,
            content: block.type === 'text' ? block.content : '',
            imageData: block.type === 'image' ? block.imageData : null
        }));
    }

    /**
     * 设置内容数据
     */
    setContentData(data) {
        this.contentBlocks = data.map(item => ({
            id: item.id || this.generateBlockId(),
            type: item.type,
            order: item.order || 0,
            content: item.type === 'text' ? (item.content || '') : '',
            imageData: item.type === 'image' ? item.imageData : null
        }));
        
        this.updateBlockOrders();
        this.activeBlockIndex = -1;
    }

    /**
     * 清空内容
     */
    clearContent() {
        this.contentBlocks = [];
        this.activeBlockIndex = -1;
    }

    /**
     * 检查是否有内容
     */
    hasContent() {
        return this.contentBlocks.some(block => {
            if (block.type === 'text') {
                return block.content.trim().length > 0;
            } else if (block.type === 'image') {
                return block.imageData !== null;
            }
            return false;
        });
    }

    /**
     * 获取内容预览（用于移动端显示）
     */
    getContentPreview() {
        const blocks = this.contentBlocks
            .sort((a, b) => a.order - b.order)
            .filter(block => {
                if (block.type === 'text') {
                    return block.content.trim().length > 0;
                } else if (block.type === 'image') {
                    return block.imageData !== null;
                }
                return false;
            });

        return blocks.map(block => {
            if (block.type === 'text') {
                return {
                    type: 'text',
                    content: block.content.trim()
                };
            } else if (block.type === 'image') {
                return {
                    type: 'image',
                    url: block.imageData.url,
                    fileName: block.imageData.fileName
                };
            }
            return null;
        }).filter(item => item !== null);
    }

    /**
     * 验证内容
     */
    validateContent() {
        const errors = [];
        
        if (this.contentBlocks.length === 0) {
            errors.push('请至少添加一个内容块');
            return { isValid: false, errors };
        }

        for (let i = 0; i < this.contentBlocks.length; i++) {
            const block = this.contentBlocks[i];
            
            if (block.type === 'text') {
                if (!block.content.trim()) {
                    errors.push(`文字段落 ${i + 1} 不能为空`);
                }
            } else if (block.type === 'image') {
                if (!block.imageData) {
                    errors.push(`图片 ${i + 1} 未上传`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * 导出内容为HTML
     */
    exportToHTML() {
        const blocks = this.contentBlocks
            .sort((a, b) => a.order - b.order)
            .filter(block => {
                if (block.type === 'text') {
                    return block.content.trim().length > 0;
                } else if (block.type === 'image') {
                    return block.imageData !== null;
                }
                return false;
            });

        let html = '';
        
        blocks.forEach(block => {
            if (block.type === 'text') {
                const content = block.content.trim()
                    .replace(/\n/g, '<br>')
                    .replace(/\s+/g, ' ');
                html += `<p>${content}</p>`;
            } else if (block.type === 'image') {
                html += `<img src="${block.imageData.url}" alt="${block.imageData.fileName}" style="max-width: 100%; height: auto; display: block; margin: 8px 0;">`;
            }
        });

        return html;
    }

    /**
     * 导出内容为纯文本
     */
    exportToText() {
        const blocks = this.contentBlocks
            .sort((a, b) => a.order - b.order)
            .filter(block => {
                if (block.type === 'text') {
                    return block.content.trim().length > 0;
                } else if (block.type === 'image') {
                    return block.imageData !== null;
                }
                return false;
            });

        let text = '';
        
        blocks.forEach(block => {
            if (block.type === 'text') {
                text += block.content.trim() + '\n\n';
            } else if (block.type === 'image') {
                text += `[图片: ${block.imageData.fileName}]\n\n`;
            }
        });

        return text.trim();
    }

    /**
     * 获取统计信息
     */
    getStats() {
        const stats = {
            totalBlocks: this.contentBlocks.length,
            textBlocks: 0,
            imageBlocks: 0,
            totalTextLength: 0,
            totalImages: 0
        };

        this.contentBlocks.forEach(block => {
            if (block.type === 'text') {
                stats.textBlocks++;
                stats.totalTextLength += block.content.length;
            } else if (block.type === 'image') {
                stats.imageBlocks++;
                if (block.imageData) {
                    stats.totalImages++;
                }
            }
        });

        return stats;
    }
}

// 创建全局内容编辑器实例
window.contentEditor = new ContentEditor();
