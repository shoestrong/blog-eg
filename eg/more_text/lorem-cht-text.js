jQuery(document).ready(function($) {

	function getRandomInt(min, max) {
		min = parseInt(min);
		max = parseInt(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function checkPrime(n) {
		var isPrim = true;
		for (var i = 2; i < n; i++) {
			if (n % i == 0) {
				isPrim = false;
				break;
			}
		}
		return isPrim;
	}


	function randomMark() {
		marks = ['，', '。', '！', '？'];
		return marks[getRandomInt(0, 3)];
	}


	function randomlorem(s, from, end) {
		result = '';

		for (i = 1; i <= s; i++) {
			mm = getRandomInt(from, end);
			for (j = 0; j < from; j++) {
				result = result + randomChar();
			}
			for (j = from; j < mm; j++) {
				result = result + randomChar();
			}
		}
		return result;
	}

	function randomChar() {
		var n = '%u' + (Math.round(Math.random() * 20901) + 19968).toString(16);
		if (checkPrime(getRandomInt(1, 23427)))
			return randomMark();
		else
		// return unescape('%u' + getRandomInt(19968, 40869).toString(16) + '');
			return unescape(n);
	}

	var lorem = $('[class*="lorem"]');

	$.each(lorem, function() {
		var match = $(this).attr('class').match(/lorem(?:\((\d+)(?:,(\d+)(?:[,-](\d+))?\))?)?/);
		if (!match[1]) {
			$(this).text(randomlorem(1, 10, 20));
		} else if (match[1] && !match[2]) {
			$(this).text(randomlorem(match[1], 10, 20));
		} else if (match[1] && match[2] && !match[3]) {
			$(this).text(randomlorem(match[1], match[2], match[2] + 3));
		} else if (match[1] && match[2] && match[3]) {
			$(this).text(randomlorem(match[1], match[2], match[3]));
		}
	});

}); //19968 ~ 40869


(function(exports) {
	var
	//用于生成随机文本的词汇，他们是前1000位常用的汉字。
		WORDS = "的一是在不了有和人这中大为上个国我以要他时来用们生到作地於出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进著等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又麼利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较长将组见计别她手角期根论运农指几九区强放决西被乾做必战先回则任取据处队南给色光门即保治北造百规热领七海地口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严首底液官德调随病苏失尔死讲配女黄推显谈罪神艺呢席含企望密批营项防举球英氧势告李台落木帮轮破亚师围注远字材排供河态封另施减树溶怎止案言士均武固叶鱼波视仅费紧爱左章早朝害续轻服试食充兵源判护司足某练差致板田降黑犯负击范继兴似余坚曲输修的故城夫够送笑船占右财吃富春职觉汉画功巴跟虽杂飞检吸助升阳互初创抗考投坏策古径换未跑留钢曾端责站简述钱副尽帝射草冲承独令限阿宣环双请超微让控州良轴找否纪益依优顶础载倒房突坐粉敌略客袁冷胜绝析块剂测丝协重诉念陈仍罗盐友洋错苦夜刑移频逐靠混母短皮终聚汽村云哪既距卫停烈央察烧迅行境若印洲刻括激孔搞甚室待核校散侵吧甲游久菜味旧模湖货损预阻毫普稳乙妈植息扩银语挥酒守拿序纸医缺雨吗针刘啊急唱误训愿审附获茶鲜粮斤孩脱硫肥善龙演父渐血欢械掌歌沙著刚攻谓盾讨晚粒乱燃矛乎杀药宁鲁贵钟煤读班伯香介迫句丰培握兰担弦蛋沉假穿执答乐谁顺烟缩征脸喜松脚困异免背星福买染井概慢怕磁倍祖皇促静补评翻肉践尼衣宽扬棉希伤操垂秋宜氢套笔督振架亮末宪庆编牛触映雷销诗座居抓裂胞呼娘景威绿晶厚盟衡鸡孙延危胶还屋乡临陆顾掉呀灯岁措束耐剧玉赵跳哥季课凯胡额款绍卷齐伟蒸殖永宗苗川妒岩弱零杨奏沿露杆探滑镇饭浓航怀赶",

		//标点符号用来生成随机文本
		PUNCTUATIONS = "，，，，。",
		vocabSize = WORDS.length,
		puncSize = PUNCTUATIONS.length,

		//两个标点符号之间最小长度
		minlengthToNextPunc = 5,
		//两个标点符号之间最大长度
		maxlengthToNextPunc = 15,

		exports = exports || window;

	/**
	 * expose the generator function to exports
	 * @param length int length of text to generate
	 * @param options JSON options used to generate text, for example: {"usePunc": false}
	 */
	exports.lorem = function(length, options) {

		var options = options || {},

			//是否包括标点在生成的文本
			usePunc = typeof options.usePunc === 'undefined' ? true : options.usePunc,

			//数组存储随机文本
			str = [],
			length = parseInt(length) || 10,
			i = 0,
			chosen,
			puncCounter = 0,

			//文本长度从目前的标点符号到下一个标点符号，一个maxlengthtonextpunc和minlengthtonextpunc之间的随机数
			lengthToNextPunc = Math.floor(Math.random() * (maxlengthToNextPunc - minlengthToNextPunc)) + minlengthToNextPunc;

		while (i < length) {

			//随机选择一个字符
			chosen = Math.floor(Math.random() * vocabSize);

			//标点符号还是正常字符？
			if (usePunc && puncCounter == lengthToNextPunc && minlengthToNextPunc < (length - i)) {

				//将随机选择标点符号
				str.push(PUNCTUATIONS.charAt(Math.floor(Math.random() * puncSize)));

				//随机选择下一个标点符号
				lengthToNextPunc = Math.floor(Math.random() * (maxlengthToNextPunc - minlengthToNextPunc)) + minlengthToNextPunc;

				//下一个标点符号重置计数器
				puncCounter = 0;

			} else { //标准字符
				str.push(WORDS.charAt(chosen));
			}
			//添加计数器
			puncCounter++;
			i++;
		}
		//句号结束
		if (usePunc) {
			str.push('。');
		}
		return str.join('');
	}
})();