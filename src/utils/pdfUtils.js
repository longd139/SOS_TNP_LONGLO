import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export async function exportPDF(elementId, fileName, options = {}) {
        document.body.classList.add('pdf-exporting');
    const input = document.getElementById(elementId);
    
    if (!input) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    const originalDisplay = input.style.display;
    const originalStyles = new Map();
    const truncateElements = new Map();
    
    const inputs = input.querySelectorAll('input, select, textarea');
    
    const elementsWithOverflow = input.querySelectorAll('.truncate, .overflow-hidden, .text-ellipsis, [class*="truncate"], [class*="overflow"]');
    elementsWithOverflow.forEach((el, index) => {
        truncateElements.set(el, {
            overflow: el.style.overflow,
            textOverflow: el.style.textOverflow,
            whiteSpace: el.style.whiteSpace,
            maxWidth: el.style.maxWidth,
            lineHeight: el.style.lineHeight
        });
        el.setAttribute('data-pdf-truncate-id', `pdf-truncate-${index}`);
        
        el.style.overflow = 'visible';
        el.style.textOverflow = 'clip';
        el.style.whiteSpace = 'normal';
    });
    
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
            direction: el.style.direction,
            lineHeight: el.style.lineHeight
        });

        el.setAttribute('data-pdf-export-id', `pdf-input-${index}`);

        el.style.visibility = 'visible';
        el.style.opacity = '1';

        if (el.tagName !== 'SELECT') {
            el.style.textAlign = 'left';
            el.style.direction = 'ltr';
            if (!el.style.paddingLeft || el.style.paddingLeft === '') {
                const computedStyle = window.getComputedStyle(el);
                el.style.paddingLeft = computedStyle.paddingLeft || '12px';
            }
        }

        if (el.type === 'date' && el.value) {
            el.setAttribute('value', el.value);
        }

    });
    
    void input.offsetHeight;
    
    await new Promise(resolve => setTimeout(resolve, 150));

    try {
        const dataUrl = await htmlToImage.toPng(input, {
            backgroundColor: '#ffffff',
            quality: 1,
            pixelRatio: 2
        });
    document.body.classList.remove('pdf-exporting');

        const img = new window.Image();
        img.src = dataUrl;
        await new Promise((resolve) => { img.onload = resolve; });

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidthPx = img.width;
        const imgHeightPx = img.height;

        const ratio = pdfWidth / imgWidthPx;
        const imgScaledWidth = pdfWidth;
        const imgScaledHeight = imgHeightPx * ratio;

        if (imgScaledHeight <= pdfHeight) {
            pdf.addImage(dataUrl, "PNG", 0, 0, imgScaledWidth, imgScaledHeight);
        } else {
            let heightLeft = imgScaledHeight;
            let position = 0;
            pdf.addImage(dataUrl, "PNG", 0, position, imgScaledWidth, imgScaledHeight);
            heightLeft -= pdfHeight;
            while (heightLeft > 0) {
                position = heightLeft - imgScaledHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, "PNG", 0, position, imgScaledWidth, imgScaledHeight);
                heightLeft -= pdfHeight;
            }
        }

        pdf.save(`${fileName || 'export'}.pdf`);
    } catch (error) {
        throw error;
    } finally {
        input.style.display = originalDisplay;
        
        truncateElements.forEach((originalStyle, el) => {
            el.style.overflow = originalStyle.overflow;
            el.style.textOverflow = originalStyle.textOverflow;
            el.style.whiteSpace = originalStyle.whiteSpace;
            el.style.maxWidth = originalStyle.maxWidth;
            el.style.lineHeight = originalStyle.lineHeight;
            el.removeAttribute('data-pdf-truncate-id');
        });
        
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
                el.style.lineHeight = originalStyle.lineHeight;
            }
            
            el.removeAttribute('data-pdf-export-id');
            
        });
    }
}
