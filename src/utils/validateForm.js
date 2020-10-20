/**
 * @description : 功能描述
 * @param {object} 参数名.
 * @return {text} 返回值.
 */
import { message } from 'ant-design-vue';
export default {
	install(Vue) {
		Vue.prototype.validateForm = function(validateArray) {
            console.log("validateArray=>",validateArray)
			let formArray = validateArray || Object.keys(this.formData);
			return !formArray.some((name) => {
				let rules = this.rules[name],
					inputValue = this.formData[name];
				if (!rules) {
					return false;
				}
				// 如果是必填字段
				if (rules.required && !inputValue) {
					message.error(rules.requiredMsg);
					return true;
				}

				// 如果是需要判断
				if (rules.validate) {
					if (!rules.validate.test(inputValue)) {
						message.error(rules.requiredMsg);
						return true;
					}
				}
				return false;
			});
		};
	}
};
