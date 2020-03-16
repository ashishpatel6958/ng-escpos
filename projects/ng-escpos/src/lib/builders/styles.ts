import _ from './commands';
export const styles = (type: any) => {
	let styled: string = '';
	switch (type.toUpperCase()) {
		case 'B':
			styled += _.TEXT_FORMAT.TXT_BOLD_ON;
			styled += _.TEXT_FORMAT.TXT_ITALIC_OFF;
			styled += _.TEXT_FORMAT.TXT_UNDERL_OFF;
			break;
		case 'I':
			styled += _.TEXT_FORMAT.TXT_BOLD_OFF;
			styled += _.TEXT_FORMAT.TXT_ITALIC_ON;
			styled += _.TEXT_FORMAT.TXT_UNDERL_OFF;
			break;
		case 'U':
			styled += _.TEXT_FORMAT.TXT_BOLD_OFF;
			styled += _.TEXT_FORMAT.TXT_ITALIC_OFF;
			styled += _.TEXT_FORMAT.TXT_UNDERL_ON;
			break;
		case 'U2':
			styled += _.TEXT_FORMAT.TXT_BOLD_OFF;
			styled += _.TEXT_FORMAT.TXT_ITALIC_OFF;
			styled += _.TEXT_FORMAT.TXT_UNDERL2_ON;
			break;

		case 'BI':
			styled += _.TEXT_FORMAT.TXT_BOLD_ON;
			styled += _.TEXT_FORMAT.TXT_ITALIC_ON;
			styled += _.TEXT_FORMAT.TXT_UNDERL_OFF;
			break;
		case 'BIU':
			styled += _.TEXT_FORMAT.TXT_BOLD_ON;
			styled += _.TEXT_FORMAT.TXT_ITALIC_ON;
			styled += _.TEXT_FORMAT.TXT_UNDERL_ON;
			break;
		case 'BIU2':
			styled += _.TEXT_FORMAT.TXT_BOLD_ON;
			styled += _.TEXT_FORMAT.TXT_ITALIC_ON;
			styled += _.TEXT_FORMAT.TXT_UNDERL2_ON;
			break;
		case 'BU':
			styled += _.TEXT_FORMAT.TXT_BOLD_ON;
			styled += _.TEXT_FORMAT.TXT_ITALIC_OFF;
			styled += _.TEXT_FORMAT.TXT_UNDERL_ON;
			break;
		case 'BU2':
			styled += _.TEXT_FORMAT.TXT_BOLD_ON;
			styled += _.TEXT_FORMAT.TXT_ITALIC_OFF;
			styled += _.TEXT_FORMAT.TXT_UNDERL2_ON;
			break;
		case 'IU':
			styled += _.TEXT_FORMAT.TXT_BOLD_OFF;
			styled += _.TEXT_FORMAT.TXT_ITALIC_ON;
			styled += _.TEXT_FORMAT.TXT_UNDERL_ON;
			break;
		case 'IU2':
			styled += _.TEXT_FORMAT.TXT_BOLD_OFF;
			styled += _.TEXT_FORMAT.TXT_ITALIC_ON;
			styled += _.TEXT_FORMAT.TXT_UNDERL2_ON;
			break;

		case 'NORMAL':
		default:
			styled += _.TEXT_FORMAT.TXT_BOLD_OFF;
			styled += _.TEXT_FORMAT.TXT_ITALIC_OFF;
			styled += _.TEXT_FORMAT.TXT_UNDERL_OFF;
			break;
	}
	return styled;
};
