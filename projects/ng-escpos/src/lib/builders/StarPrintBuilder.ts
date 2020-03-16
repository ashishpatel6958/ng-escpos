import { PrintBuilder } from './PrintBuilder';
import { PrintBuffer } from './PrintBuffer';
import _ from './commands';
import { styles } from './styles';

declare var TextEncoder: any;

const ESC = 0x1b;
const GS = 0x1d;

export class StarPrintBuilder extends PrintBuilder {
    private encoder = new TextEncoder();
    private buffer: PrintBuffer;
    private size: number;
    constructor() {
        super();
        this.size = 48;
    }

    init(): StarPrintBuilder {
        this.buffer = new PrintBuffer();
        this.write(ESC);
        this.write('@');
        return this;
    }

    flush(): Uint8Array {
        return this.buffer.flush();
    }

    feed(lineCount: number = 1): StarPrintBuilder {
        this.write(ESC);
        this.write('a');
        this.write(lineCount);

        return this;
    }

    cut(cutType: string = 'full'): StarPrintBuilder {
        this.write(ESC);
        this.write('d');
        this.write(cutType === 'full' ? 2 : 3);

        return this;
    }

    writeLine(value: string): StarPrintBuilder {
        return this.write(`${value}\n`);
    }

    setPageSize(size: number): StarPrintBuilder {
        this.size = size;
        return this;
    }

    drawLine(): StarPrintBuilder {
        let lineText = '';
        for (let i = 0; i < this.size; i++) {
            lineText += '-';
        }
        return this.write(`${lineText}\n`);
    }

    writeTable(data: any): StarPrintBuilder {
        let cellWidth = this.size / data.length;
        let lineTxt = '';

        for (let i = 0; i < data.length; i++) {
            lineTxt += data[i].toString();

            let spaces = cellWidth - data[i].toString().length;
            for (let j = 0; j < spaces; j++) {
                lineTxt += ' ';
            }
        }
        return this.write(`${lineTxt}\n`);
    }

    writeCustomTable(data: any, options: any): StarPrintBuilder {
        options = options || { size: [] };
        options.size = options.size || [];
        let [width = 1, height = 1] = options.size || [];
        let baseWidth = Math.floor(this.size / width);
        let cellWidth = Math.floor(baseWidth / data.length);
        let leftoverSpace = baseWidth - cellWidth * data.length;
        let lineStr = '';
        let secondLineEnabled = false;
        let secondLine = [];

        for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            let align = (obj.align || '').toUpperCase();
            let tooLong = false;

            obj.text = obj.text.toString();
            let textLength = obj.text.length;

            if (obj.width) {
                cellWidth = baseWidth * obj.width;
            } else if (obj.cols) {
                cellWidth = obj.cols;
            }

            if (cellWidth < textLength) {
                tooLong = true;
                obj.originalText = obj.text;
                obj.text = obj.text.substring(0, cellWidth);
            }

            if (align === 'CENTER') {
                let spaces = (cellWidth - textLength) / 2;
                for (let s = 0; s < spaces; s++) {
                    lineStr += ' ';
                }

                if (obj.text !== '') {
                    if (obj.style) {
                        lineStr +=
                            styles(obj.style) + obj.text + styles('NORMAL');
                    } else {
                        lineStr += obj.text;
                    }
                }

                for (let s = 0; s < spaces - 1; s++) {
                    lineStr += ' ';
                }
            } else if (align === 'RIGHT') {
                let spaces = cellWidth - textLength;
                if (leftoverSpace > 0) {
                    spaces += leftoverSpace;
                    leftoverSpace = 0;
                }

                for (let s = 0; s < spaces; s++) {
                    lineStr += ' ';
                }

                if (obj.text !== '') {
                    if (obj.style) {
                        lineStr +=
                            styles(obj.style) + obj.text + styles('NORMAL');
                    } else {
                        lineStr += obj.text;
                    }
                }
            } else {
                if (obj.text !== '') {
                    if (obj.style) {
                        lineStr +=
                            styles(obj.style) + obj.text + styles('NORMAL');
                    } else {
                        lineStr += obj.text;
                    }
                }

                let spaces = Math.floor(cellWidth - textLength);
                if (leftoverSpace > 0) {
                    spaces += leftoverSpace;
                    leftoverSpace = 0;
                }

                for (let s = 0; s < spaces; s++) {
                    lineStr += ' ';
                }
            }

            if (tooLong) {
                secondLineEnabled = true;
                obj.text = obj.originalText.substring(cellWidth);
                secondLine.push(obj);
            } else {
                obj.text = '';
                secondLine.push(obj);
            }
        }

        // Set size to line
        if (width > 1) {
            lineStr =
                _.TEXT_FORMAT.TXT_CUSTOM_SIZE(width, height) +
                lineStr +
                _.TEXT_FORMAT.TXT_NORMAL;
        }

        // Write the line
        this.write(`${lineStr}\n`);

        if (secondLineEnabled) {
            // Writes second line if has
            return this.writeCustomTable(secondLine, options);
        } else {
            if (options.feed) {
                this.feed(options.feed);
            }
            if (options.drawLine) {
                this.drawLine();
            }
            return this;
        }
    }

    setInverse(inverse: boolean = true): StarPrintBuilder {
        this.write(ESC);
        inverse ? this.write('4') : this.write('5');

        return this;
    }

    setUnderline(underline: boolean = true): StarPrintBuilder {
        this.write(ESC);
        this.write('-');
        this.write(underline ? 1 : 0);
        return this;
    }

    setJustification(value: string): StarPrintBuilder {
        let alignment;
        switch (value) {
            case 'center':
                alignment = 1;
                break;
            case 'right':
                alignment = 2;
                break;
            default:
                alignment = 0;
                break;
        }

        this.write(ESC);
        this.write(GS);
        this.write('a');
        this.write(alignment);

        return this;
    }

    setBold(bold: boolean = true): StarPrintBuilder {
        this.write(ESC);
        bold ? this.write('E') : this.write('F');

        return this;
    }

    setSize(size: string): StarPrintBuilder {
        this.write(ESC);
        this.write('i');
        this.write(size === 'normal' ? 0 : 1);
        this.write(size === 'normal' ? 0 : 1);

        return this;
    }

    private write(value: string | Uint8Array | number): any {
        if (typeof value === 'number') {
            this.buffer.writeUInt8(value);
        } else if (typeof value === 'string') {
            this.buffer.write(this.encoder.encode(value));
        } else {
            this.buffer.write(value);
        }
        return this;
    }
}
