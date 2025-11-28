import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportPDF(elementId, fileName, options = {}) {
    const input = document.getElementById(elementId);
    
    if (!input) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    const originalDisplay = input.style.display;
    const originalStyles = new Map();
    
    const inputs = input.querySelectorAll('input, select, textarea');
    
    input.style.display = 'block';
    input.style.visibility = 'visible';
    
    inputs.forEach((el, index) => {
        originalStyles.set(el, {
            textAlign: el.style.textAlign,
            paddingLeft: el.style.paddingLeft,
            paddingRight: el.style.paddingRight,
            textIndent: el.style.textIndent,
            visibility: el.style.visibility,
            opacity: el.style.opacity,
            direction: el.style.direction
        });
        
        el.setAttribute('data-pdf-export-id', `pdf-input-${index}`);
        
        el.style.textAlign = 'left';
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.direction = 'ltr';
        
        if (!el.style.paddingLeft || el.style.paddingLeft === '') {
            const computedStyle = window.getComputedStyle(el);
            el.style.paddingLeft = computedStyle.paddingLeft || '12px';
        }
        
        if (el.type === 'date' && el.value) {
            el.setAttribute('value', el.value);
        }
        
        if (el.tagName === 'SELECT') {
            el.style.appearance = 'none';
            el.style.webkitAppearance = 'none';
            el.style.mozAppearance = 'none';
        }
    });
    
    void input.offsetHeight;
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            removeContainer: false,
            onclone: (clonedDoc) => {
                const clonedInputs = clonedDoc.querySelectorAll('input, select, textarea');
                clonedInputs.forEach((el) => {
                    const exportId = el.getAttribute('data-pdf-export-id');
                    const originalEl = exportId ? input.querySelector(`[data-pdf-export-id="${exportId}"]`) : null;
                    
                    el.style.textAlign = 'left';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                    el.style.direction = 'ltr';
                    
                    if (originalEl) {
                        const computedStyle = window.getComputedStyle(originalEl);
                        el.style.paddingLeft = computedStyle.paddingLeft || '12px';
                    } else if (!el.style.paddingLeft || el.style.paddingLeft === '') {
                        el.style.paddingLeft = '12px';
                    }
                    
                    if (el.type === 'date' && el.value) {
                        el.setAttribute('value', el.value);
                    }
                    
                    if (el.tagName === 'SELECT') {
                        el.style.appearance = 'none';
                        el.style.webkitAppearance = 'none';
                        el.style.mozAppearance = 'none';
                    }
                });
            },
            ...options.html2canvas
        });

        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = canvas.width / 2; 
        const imgHeight = canvas.height / 2;
        
        const dpi = 96;
        const mmPerInch = 25.4;
        const pxToMm = mmPerInch / dpi;
        const imgWidthMm = imgWidth * pxToMm;
        const imgHeightMm = imgHeight * pxToMm;
        
        const widthRatio = pdfWidth / imgWidthMm;
        const imgScaledWidth = pdfWidth;
        const imgScaledHeight = imgHeightMm * widthRatio;
        
        if (imgScaledHeight <= pdfHeight) {
            pdf.addImage(imgData, "PNG", 0, 0, imgScaledWidth, imgScaledHeight);
        } else {
            let heightLeft = imgScaledHeight;
            let position = 0;
            
            pdf.addImage(imgData, "PNG", 0, position, imgScaledWidth, imgScaledHeight);
            heightLeft -= pdfHeight;
            
            while (heightLeft > 0) {
                position = heightLeft - imgScaledHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgScaledWidth, imgScaledHeight);
                heightLeft -= pdfHeight;
            }
        }

        pdf.save(`${fileName || 'export'}.pdf`);
    } catch (error) {
        console.error('Error exporting PDF:', error);
        throw error;
    } finally {
        input.style.display = originalDisplay;
        
        inputs.forEach((el) => {
            const originalStyle = originalStyles.get(el);
            if (originalStyle) {
                el.style.textAlign = originalStyle.textAlign;
                el.style.paddingLeft = originalStyle.paddingLeft;
                el.style.paddingRight = originalStyle.paddingRight;
                el.style.textIndent = originalStyle.textIndent;
                el.style.visibility = originalStyle.visibility;
                el.style.opacity = originalStyle.opacity;
                el.style.direction = originalStyle.direction;
            }
            
            el.removeAttribute('data-pdf-export-id');
            
            if (el.tagName === 'SELECT') {
                el.style.appearance = '';
                el.style.webkitAppearance = '';
                el.style.mozAppearance = '';
            }
        });
    }
}
