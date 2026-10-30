const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname, 'index.html'), 'utf8');
const marked = html.match(/\/\*__PUNCTUATE_START__\*\/([\s\S]*?)\/\*__PUNCTUATE_END__\*\//);
if (!marked) {
  console.error('punctuation block missing from index.html');
  process.exit(1);
}
const punctuateChinese = new Function(marked[1] + '\nreturn punctuateChinese;')();

const cases = [
  ['', ''],
  ['   ', ''],
  ['你好嗎', '你好嗎？'],
  ['你要什麼', '你要什麼？'],
  ['這是什麼東西', '這是什麼東西？'],
  ['你今天為什麼沒有來', '你今天為什麼沒有來？'],
  ['怎麼辦', '怎麼辦？'],
  ['你是誰', '你是誰？'],
  ['多少錢', '多少錢？'],
  ['術後多久要回診', '術後多久要回診？'],
  ['你要不要開刀', '你要不要開刀？'],
  ['這個是不是攝護腺肥大', '這個是不是攝護腺肥大？'],
  ['我們走吧', '我們走吧？'],
  ['今天這麼冷', '今天這麼冷。'],
  ['沒有那麼嚴重', '沒有那麼嚴重。'],
  ['什麼都好', '什麼都好。'],
  ['我知道這是什麼東西', '我知道這是什麼東西。'],
  ['患者不知道為什麼會痛', '患者不知道為什麼會痛。'],
  ['我之所以來是想問攝護腺', '我之所以來是想問攝護腺。'],
  ['不做是因為太貴', '不做是因為太貴。'],
  ['今天天氣很好但是我想待在家', '今天天氣很好，但是我想待在家。'],
  ['因為下雨所以沒去', '因為下雨，所以沒去。'],
  ['吃完飯之後我們去散步', '吃完飯之後，我們去散步。'],
  ['開刀之後要注意什麼', '開刀之後，要注意什麼？'],
  ['例如這個藥要飯後吃', '例如：這個藥要飯後吃。'],
  ['我的意思是先觀察', '我的意思是，先觀察。'],
  ['醫師您好我想問一下頻尿', '醫師您好，我想問一下頻尿。'],
  ['太好了', '太好了！'],
  ['你好，世界', '你好，世界。'],
  ['你要開刀嗎。', '你要開刀嗎？'],
  ['走不過這條路', '走不過這條路。'],
  ['有點痛不過還能走', '有點痛，不過還能走。'],
  ['很久以前的事', '很久以前的事。'],
  ['三年以前他就開過刀', '三年以前，他就開過刀。'],
  ['PSA 4.5 升高但是沒有症狀', 'PSA 4.5升高，但是沒有症狀。'],
  ['1.5公分', '1.5公分。'],
  [
    '患者五十八歲主訴頻尿夜尿但是沒有血尿也沒有疼痛所以先安排尿液檢查',
    '患者五十八歲主訴頻尿夜尿，但是沒有血尿，也沒有疼痛，所以先安排尿液檢查。',
  ],
  [
    '醫師，這個要開刀嗎？不用，先觀察。太好了！',
    '醫師，這個要開刀嗎？不用，先觀察。太好了！',
  ],
  [
    '醫師，這個要開刀嗎。不用，先觀察。太好了。',
    '醫師，這個要開刀嗎？不用，先觀察。太好了！',
  ],
  ['第一句嗎\n\n第二句但是還是想確認病情', '第一句嗎？\n\n第二句，但是還是想確認病情。'],
  ['hello', 'hello'],
  ['要如何處理', '要如何處理？'],
  ['無論是否同意都先記錄', '無論是否同意都先記錄。'],
  ['您是否同意手術', '您是否同意手術？'],
  ['這個藥怎麼吃', '這個藥怎麼吃？'],
  ['今天天氣很好 但是我想出去', '今天天氣很好，但是我想出去。'],
];

let failed = 0;
for (const [input, expected] of cases) {
  const once = punctuateChinese(input);
  const twice = punctuateChinese(once);
  if (once !== expected) {
    failed += 1;
    console.error('MISMATCH\n  in:  ' + JSON.stringify(input) + '\n  out: ' + JSON.stringify(once) + '\n  exp: ' + JSON.stringify(expected));
  } else if (twice !== once) {
    failed += 1;
    console.error('NOT IDEMPOTENT\n  in:  ' + JSON.stringify(input) + '\n  once: ' + JSON.stringify(once) + '\n  twice:' + JSON.stringify(twice));
  }
}
if (failed) {
  console.error(failed + ' failed');
  process.exit(1);
}
console.log(cases.length + ' punctuation cases passed');
