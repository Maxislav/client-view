import { evaluateParsedString, parseStringTemplateGenerator } from 'string-template-parser';
const parseAngularStringTemplate = parseStringTemplateGenerator({
  VARIABLE_START: /^\{\{\s*/,
  VARIABLE_END: /^\s*\}\}/
});

export const elementGenerate = (el: Element, template: string, style: {[key: string]: any}) => {
  el.innerHTML = evaluateParsedString(parseAngularStringTemplate(template), {...style}, null);
};
