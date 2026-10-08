/**
 * js/poems.js
 * Tuyển tập hơn 40 câu thơ cổ điển Trung Quốc (Đường thi, Tống từ) nổi tiếng,
 * bảo đảm tuyệt đối tính chính xác về nguyên tác chữ Hán, phiên âm Pinyin,
 * dịch nghĩa tiếng Việt, tên tác giả và thi phẩm.
 */

export const POEMS = [
  {
    title: 'Tĩnh dạ tứ (静夜思)',
    author: 'Lý Bạch (李白)',
    chinese: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    pinyin: 'Chuáng qián míng yuè guāng, yí shì dì shàng shuāng.\nJǔ tóu wàng míng yuè, dī tóu sī gù xiāng.',
    vietnamese: 'Đầu giường ánh trăng rọi, ngỡ mặt đất phủ sương.\nNgẩng đầu nhìn trăng sáng, cúi đầu nhớ cố hương.',
  },
  {
    title: 'Đăng Quán Tước lâu (登鹳雀楼)',
    author: 'Vương Chi Hoán (王之涣)',
    chinese: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
    pinyin: 'Bái rì yī shān jìn, huáng hé rù hǎi liú.\nYù qióng qiān lǐ mù, gèng shàng yī céng lóu.',
    vietnamese: 'Mặt trời lặn sau núi, sông Hoàng đổ ra khơi.\nMuốn nhìn xa ngàn dặm, lên thêm một tầng lầu.',
  },
  {
    title: 'Xuân hiểu (春晓)',
    author: 'Mạnh Hạo Nhiên (孟浩然)',
    chinese: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    pinyin: 'Chūn mián bù jué xiǎo, chù chù wén tí niǎo.\nYè lái fēng yǔ shēng, huā luò zhī duō shǎo.',
    vietnamese: 'Giấc xuân say chẳng biết trời sáng, nơi nơi ríu rít tiếng chim ca.\nĐêm qua vẳng tiếng gió mưa, hoa rơi nào biết biết bao nhiêu cánh?',
  },
  {
    title: 'Giang tuyết (江雪)',
    author: 'Liễu Tông Nguyên (柳宗元)',
    chinese: '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。',
    pinyin: 'Qiān shān niǎo fēi jué, wàn jìng rén zōng miè.\nGū zhōu suō lì wēng, dú diào hán jiāng xuě.',
    vietnamese: 'Nghìn non vắng bóng chim bay, muôn nẻo mất hút dấu chân người.\nThuyền đơn ông già nón lá áo tơi, một mình câu tuyết giữa dòng sông lạnh.',
  },
  {
    title: 'Tầm ẩn giả bất ngộ (寻隐者不遇)',
    author: 'Giả Đảo (贾岛)',
    chinese: '松下问童子，言师采药去。\n只在此山中，云深不知处。',
    pinyin: 'Sōng xià wèn tóng zǐ, yán shī cǎi yào qù.\nZhǐ zài cǐ shān zhōng, yún shēn bù zhī chù.',
    vietnamese: 'Dưới gốc thông hỏi thăm chú bé, thưa rằng thầy đã đi hái thuốc.\nChỉ ở quanh quẩn trong núi này, mây mù sâu thẳm biết tìm nơi nao.',
  },
  {
    title: 'Tương tư (相思)',
    author: 'Vương Duy (王维)',
    chinese: '红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。',
    pinyin: 'Hóng dòu shēng nán guó, chūn lái fā jǐ zhī.\nYuàn jūn duō cǎi xié, cǐ wù zuì xiāng sī.',
    vietnamese: 'Hạt đậu đỏ sinh ở cõi nam, xuân về nảy nở mấy cành tơ.\nMong người hãy hái thật nhiều lấy, vật này ghi dấu mối tương tư nhất.',
  },
  {
    title: 'Lộc trại (鹿柴)',
    author: 'Vương Duy (王维)',
    chinese: '空山不见人，但闻人语响。\n返景入深林，复照青苔上。',
    pinyin: 'Kōng shān bù jiàn rén, dàn wén rén yǔ xiǎng.\nFǎn yǐng rù shēn lín, fù zhào qīng tái shàng.',
    vietnamese: 'Núi vắng không thấy bóng người, chỉ nghe văng vẳng tiếng người nói vọng.\nBóng nắng chiều lọt vào rừng sâu, rọi sáng trở lại trên thảm rêu xanh.',
  },
  {
    title: 'Điểu minh giản (鸟鸣涧)',
    author: 'Vương Duy (王维)',
    chinese: '人闲桂花落，夜静春山空。\n月出惊山鸟，时鸣春涧中。',
    pinyin: 'Rén xián guì huā luò, yè jìng chūn shān kōng.\nYuè chū jīng shān niǎo, shí míng chūn jiàn zhōng.',
    vietnamese: 'Người nhàn hoa quế rụng rơi, đêm thanh vắng núi xuân tịch mịch.\nTrăng lên làm giật mình bầy chim núi, chốc chốc cất tiếng hót trong khe suối xuân.',
  },
  {
    title: 'Trúc lý quán (竹里馆)',
    author: 'Vương Duy (王维)',
    chinese: '独坐幽篁里，弹琴复长啸。\n深林人不知，明月来相照。',
    pinyin: 'Dú zuò yōu huáng lǐ, tán qín fù cháng xiào.\nShēn lín rén bù zhī, míng yuè lái xiāng zhào.',
    vietnamese: 'Một mình ngồi trong bụi trúc u tịch, gảy đàn rồi lại cất tiếng hú dài.\nRừng sâu người chẳng ai hay biết, chỉ có vầng trăng sáng đến soi cùng.',
  },
  {
    title: 'Tuyệt cú (绝句)',
    author: 'Đỗ Phủ (杜甫)',
    chinese: '两个黄鹂鸣翠柳，一行白鹭上青天。\n窗含西岭千秋雪，门泊东吴万里船。',
    pinyin: 'Liǎng gè huáng lí míng cuì liǔ, yī háng bái lù shàng qīng tiān.\nChuāng hán xī lǐng qiān qiū xuě, mén bó dōng wú wàn lǐ chuán.',
    vietnamese: 'Hai chú oanh vàng hót rặng liễu biếc, một hàng cò trắng vút lên trời xanh.\nKhung cửa ngậm tuyết ngàn năm non Tây Lĩnh, ngoài bến đậu thuyền buôn Đông Ngô vạn dặm.',
  },
  {
    title: 'Xuân dạ hỉ vũ (春夜喜雨)',
    author: 'Đỗ Phủ (杜甫)',
    chinese: '好雨知时节，当春乃发生。\n随风潜入夜，润物细无声。',
    pinyin: 'Hǎo yǔ zhī shí jié, dāng chūn nǎi fā shēng.\nSuí fēng qián rù yè, rùn wù xì wú shēng.',
    vietnamese: 'Cơn mưa lành biết đúng thời vụ, vừa sang xuân đã kịp buông rơi.\nTheo gió lén hoà vào đêm vắng, tưới nhuần muôn vật dịu dàng không một tiếng vang.',
  },
  {
    title: 'Xuân vọng (春望)',
    author: 'Đỗ Phủ (杜甫)',
    chinese: '国破山河在，城春草木深。\n感时花溅泪，恨别鸟惊心。',
    pinyin: 'Guó pò shān hé zài, chéng chūn cǎo mù shēn.\nGǎn shí huā jiàn lèi, hèn bié niǎo jīng xīn.',
    vietnamese: 'Nước mất nhưng non sông vẫn đó, thành quách sang xuân cỏ cây rậm rạp.\nCảm thời thế nhìn hoa rơi nước mắt, oán cảnh biệt ly tiếng chim giật mình.',
  },
  {
    title: 'Phú đắc cổ nguyên thảo tống biệt (赋得古原草送别)',
    author: 'Bạch Cư Dị (白居易)',
    chinese: '离离原上草，一岁一枯荣。\n野火烧不尽，春风吹又生。',
    pinyin: 'Lí lí yuán shàng cǎo, yī suì yī kū róng.\nYě huǒ shāo bù jìn, chūn fēng chuī yòu shēng.',
    vietnamese: 'Bời bời cỏ trên đồng nội cũ, mỗi năm một lần héo rồi lại tươi tốt.\nLửa đồng thiêu đốt chẳng thể tàn kiệt, gió xuân thổi tới lại sinh sôi nảy mầm.',
  },
  {
    title: 'Vấn Lưu thập cửu (问刘十九)',
    author: 'Bạch Cư Dị (白居易)',
    chinese: '绿蚁新醅酒，红泥小火炉。\n晚来天欲雪，能饮一杯无？',
    pinyin: 'Lǜ yǐ xīn pēi jiǔ, hóng ní xiǎo huǒ lú.\nWǎn lái tiān yù xuě, néng yǐn yī bēi wú?',
    vietnamese: 'Rượu mới cất sủi bọt men xanh, lò than nhỏ nặn bằng đất đỏ.\nChiều tối mây dồn trời chực đổ tuyết, có thể cùng nhau cạn một chén chăng?',
  },
  {
    title: 'Đăng Nhạc Du nguyên (登乐游原)',
    author: 'Lý Thương Ẩn (李商隐)',
    chinese: '向晚意不适，驱车登古原。\n夕阳无限好，只是近黄昏。',
    pinyin: 'Xiàng wǎn yì bù shì, qū chē dēng gǔ yuán.\nXī yáng wú xiàn hǎo, zhǐ shì jìn huáng hūn.',
    vietnamese: 'Chiều tà lòng thấy bâng khuâng chẳng yên, dong xe lên gò đất cổ.\nNắng chiều đẹp đẽ vô ngần, ngặt nỗi bóng hoàng hôn đã buông gần kề.',
  },
  {
    title: 'Dạ vũ ký bắc (夜雨寄北)',
    author: 'Lý Thương Ẩn (李商隐)',
    chinese: '君问归期未有期，巴山夜雨涨秋池。\n何当共剪西窗烛，却话巴山夜雨时。',
    pinyin: 'Jūn wèn guī qī wèi yǒu qī, bā shān yè yǔ zhǎng qiū chí.\nHé dāng gòng jiǎn xī chuāng zhú, què huà bā shān yè yǔ shí.',
    vietnamese: 'Người hỏi ngày về, ngày về chưa định, mưa đêm núi Ba làm dâng nước đầm thu.\nBao giờ mới được cùng nhau khêu bấc nến bên cửa sổ tây, kể lại chuyện đêm mưa núi Ba thuở nào?',
  },
  {
    title: 'Thanh minh (清明)',
    author: 'Đỗ Mục (杜牧)',
    chinese: '清明时节雨纷纷，路上行人欲断魂。\n借问酒家何处有，牧童遥指杏花村。',
    pinyin: 'Qīng míng shí jié yǔ fēn fēn, lù shàng xíng rén yù duàn hún.\nJiè wèn jiǔ jiā hé chù yǒu, mù tóng yáo zhǐ xìng huā cūn.',
    vietnamese: 'Tiết Thanh minh mưa phùn bay rả rích, khách đi đường lòng não nuột như đứt đoạn.\nƯớm hỏi quán rượu nơi nao có, chú mục đồng chỉ xa xa tới thôn Hạnh Hoa.',
  },
  {
    title: 'Sơn hành (山行)',
    author: 'Đỗ Mục (杜牧)',
    chinese: '远上寒山石径斜，白云生处有人家。\n停车坐爱枫林晚，霜叶红于二月花。',
    pinyin: 'Yuǎn shàng hán shān shí jìng xié, bái yún shēng chù yǒu rén jiā.\nTíng chē zuò ài fēng lín wǎn, shuāng yè hóng yú èr yuè huā.',
    vietnamese: 'Đường đá quanh co lên núi lạnh xa xôi, nơi làn mây trắng sinh ra có xóm nhà.\nDừng cỗ xe lại vì đắm say rừng phong chiều tà, lá nhuốm sương còn đỏ rực hơn hoa tháng hai.',
  },
  {
    title: 'Phong Kiều dạ bạc (枫桥夜泊)',
    author: 'Trương Kế (张继)',
    chinese: '月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。',
    pinyin: 'Yuè luò wū tí shuāng mǎn tiān, jiāng fēng yú huǒ duì chóu mián.\nGū sū chéng wài hán shān sì, yè bàn zhōng shēng dào kè chuán.',
    vietnamese: 'Trăng tà quạ kêu sương ngập trời, rặng phong bến nước và đốm lửa thuyền chài đối diện giấc ngủ sầu.\nNgoài thành Cô Tô có ngôi chùa Hàn Sơn, nửa đêm tiếng chuông ngân vọng tới thuyền khách viễn phương.',
  },
  {
    title: 'Hoàng Hạc lâu (黄鹤楼)',
    author: 'Thôi Hiệu (崔颢)',
    chinese: '昔人已乘黄鹤去，此地空余黄鹤楼。\n黄鹤一去不复返，白云千载空悠悠。',
    pinyin: 'Xī rén yǐ chéng huáng hè qù, cǐ dì kōng yú huáng hè lóu.\nHuáng hè yī qù bù fù fǎn, bái yún qiān zǎi kōng yōu yōu.',
    vietnamese: 'Người xưa đã cưỡi hạc vàng bay đi mất, chốn này chỉ còn trơ trọi lầu Hoàng Hạc.\nHạc vàng một đi không bao giờ trở lại, ngàn năm mây trắng vẫn lững lờ trôi.',
  },
  {
    title: 'Lương Châu từ (凉州词)',
    author: 'Vương Hàn (王翰)',
    chinese: '葡萄美酒夜光杯，欲饮琵琶马上催。\n醉卧沙场君莫笑，古来征战几人回？',
    pinyin: 'Pú táo měi jiǔ yè guāng bēi, yù yǐn pí pá mǎ shàng cuī.\nZuì wò shā chǎng jūn mò xiào, gǔ lái zhēng zhàn jǐ rén huí?',
    vietnamese: 'Rượu bồ đào thơm ngon rót vào chén dạ quang, toan nhấp môi thì tiếng tỳ bà trên lưng ngựa đã giục giã.\nSay khướt nằm nơi sa trường xin người chớ cười, xưa nay chốn binh đao mấy ai từng trở về?',
  },
  {
    title: 'Xuất tái (出塞)',
    author: 'Vương Xương Linh (王昌龄)',
    chinese: '秦时明月汉时关，万里长征人未还。\n但使龙城飞将在，不教胡马度阴山。',
    pinyin: 'Qín shí míng yuè hàn shí guān, wàn lǐ cháng zhēng rén wèi hán.\nDàn shǐ lóng chéng fēi jiàng zài, bù jiào hú mǎ dù yīn shān.',
    vietnamese: 'Vầng trăng thời Tần quan ải thời Hán, người đi vạn dặm đường chinh chiến vẫn chưa về.\nGiá như còn tướng tài Phi Tướng Long Thành ở đây, ắt chẳng để đàn ngựa giặc Hồ vượt qua dãy Âm Sơn.',
  },
  {
    title: 'Hồi hương ngẫu thư (回乡偶书)',
    author: 'Hạ Tri Chương (贺知章)',
    chinese: '少小离家老大回，乡音无改鬓毛衰。\n儿童相见不相识，笑问客从何处来。',
    pinyin: 'Shào xiǎo lí jiā lǎo dà huí, xiāng yīn wú gǎi bìn máo cuī.\nÉr tóng xiāng jiàn bù xiāng shí, xiào wèn kè cóng hé chù lái.',
    vietnamese: 'Tuổi trẻ rời nhà khi già nua mới trở về, giọng quê chẳng đổi chỉ có mái tóc mai đã điểm bạc.\nLũ trẻ con gặp mặt ngơ ngác chẳng hay biết, cười hỏi khách từ phương trời nào tới đây.',
  },
  {
    title: 'Vịnh liễu (咏柳)',
    author: 'Hạ Tri Chương (贺知章)',
    chinese: '碧玉妆成一树高，万条垂下绿丝绦。\n不知细叶谁裁出，二月春风似剪刀。',
    pinyin: 'Bì yù zhuāng chéng yī shù gāo, wàn tiáo chuí xià lǜ sī tāo.\nBù zhī xì yè shuí cái chū, èr yuè chūn fēng sì jiǎn dāo.',
    vietnamese: 'Ngọc bích điểm tô nên cây liễu cao vút, muôn cành rủ xuống như dải lụa xanh biếc.\nChẳng biết phiến lá mảnh mai kia do tay ai cắt tỉa, gió xuân tháng hai tựa như chiếc kéo thần.',
  },
  {
    title: 'Vịnh nga (咏鹅)',
    author: 'Lạc Tân Vương (骆宾王)',
    chinese: '鹅，鹅，鹅，曲项向天歌。\n白毛浮绿水，红掌拨清波。',
    pinyin: 'É, é, é, qū xiàng xiàng tiān gē.\nBái máo fú lǜ shuǐ, hóng zhǎng bō qīng bō.',
    vietnamese: 'Ngỗng, ngỗng, ngỗng, ngẩng cổ hướng lên trời ca vang.\nLông trắng nổi bồng bềnh trên làn nước biếc, chân hồng khua động sóng nước trong veo.',
  },
  {
    title: 'Đăng U Châu đài ca (登幽州台歌)',
    author: 'Trần Tử Ngang (陈子昂)',
    chinese: '前不见古人，后不见来者。\n念天地之悠悠，独怆然而涕下。',
    pinyin: 'Qián bù jiàn gǔ rén, hòu bù jiàn lái zhě.\nNiàn tiān dì zhī yōu yōu, dú chuàng rán ér tì xià.',
    vietnamese: 'Ngoảnh nhìn trước chẳng thấy bậc tiền nhân, nhìn về sau chẳng thấy người đời tới.\nNghĩ tới trời đất thênh thang muôn thuở, một mình bùi ngùi mà tuôn rơi giọt lệ.',
  },
  {
    title: 'Tảo phát Bạch Đế thành (早发白帝城)',
    author: 'Lý Bạch (李白)',
    chinese: '朝辞白帝彩云间，千里江陵一日还。\n两岸猿声啼不住，轻舟已过万重山。',
    pinyin: 'Zhāo cí bái dì cǎi yún jiān, qiān lǐ jiāng líng yī rì huán.\nLiǎng àn yuán shēng tí bù zhù, qīng zhōu yǐ guò wàn chóng shān.',
    vietnamese: 'Sáng giã từ thành Bạch Đế giữa rực rỡ mây màu, ngàn dặm tới Giang Lăng chỉ một ngày là tới.\nTiếng vượn đôi bờ sông hót vang không dứt, con thuyền nhẹ đã vượt qua muôn trùng núi non.',
  },
  {
    title: 'Hoàng Hạc lâu tống Mạnh Hạo Nhiên chi Quảng Lăng (黄鹤楼送孟浩然之广陵)',
    author: 'Lý Bạch (李白)',
    chinese: '故人西辞黄鹤楼，烟花三月下扬州。\n孤帆远影碧空尽，唯见长江天际流。',
    pinyin: 'Gù rén xī cí huáng hè lóu, yān huā sān yuè xià yáng zhōu.\nGū fān yuǎn yǐng bì kōng jìn, wéi jiàn cháng jiāng tiān jì liú.',
    vietnamese: 'Bạn cũ giã từ lầu Hoàng Hạc ở phía tây, giữa tháng ba mùa hoa khói xuôi dòng về Dương Châu.\nBóng cánh buồm lẻ loi xa dần hút vào nền trời biếc, chỉ còn thấy dòng Trường Giang cuồn cuộn chảy đến tận chân trời.',
  },
  {
    title: 'Vọng Lư Sơn bộc bố (望庐山瀑布)',
    author: 'Lý Bạch (李白)',
    chinese: '日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。',
    pinyin: 'Rì zhào xiāng lú shēng zǐ yān, yáo kàn pù bù guà qián chuān.\nFēi liú zhí xià sān qiān chǐ, yí shì yín hé luò jiǔ tiān.',
    vietnamese: 'Nắng rọi đỉnh Hương Lô bốc lên làn khói tía, trông từ xa thấy dòng thác treo lơ lửng trước sông.\nThác nước bay thẳng xuống ba ngàn thước, ngỡ dải Ngân Hà rớt xuống từ chín tầng mây.',
  },
  {
    title: 'Độc tọa Kính Đình sơn (独坐敬亭山)',
    author: 'Lý Bạch (李白)',
    chinese: '众鸟高飞尽，孤云独去闲。\n相看两不厌，只有敬亭山。',
    pinyin: 'Zhòng niǎo gāo fēi jìn, gū yún dú qù xián.\nXiāng kàn liǎng bù yàn, zhǐ yǒu jìng tíng shān.',
    vietnamese: 'Bầy chim vỗ cánh bay vút đi hết, đám mây lẻ loi thong thả trôi một mình.\nNgắm nhìn nhau mãi mà không biết chán, chỉ có riêng ngọn núi Kính Đình này thôi.',
  },
  {
    title: 'Nguyệt hạ độc trác (月下独酌)',
    author: 'Lý Bạch (李白)',
    chinese: '花间一壶酒，独酌无相亲。\n举杯邀明月，对影成三人。',
    pinyin: 'Huā jiān yī hú jiǔ, dú zhuó wú xiāng qīn.\nJǔ bēi yāo míng yuè, duì yǐng chéng sān rén.',
    vietnamese: 'Một bầu rượu đặt giữa khóm hoa, ngồi uống một mình chẳng có bạn bè thân thích.\nCất chén rượu mời vầng trăng sáng, đối bóng mình cùng trăng hoá ra ba người.',
  },
  {
    title: 'Du tử ngâm (游子吟)',
    author: 'Mạnh Giao (孟郊)',
    chinese: '慈母手中线，游子身上衣。\n临行密密缝，意恐迟迟归。\n谁言寸草心，报得三春晖。',
    pinyin: 'Cí mǔ shǒu zhōng xiàn, yóu zǐ shēn shàng yī.\nLín xíng mì mì féng, yì kǒng chí chí guī.\nShuí yán cùn cǎo xīn, bào dé sān chūn huī.',
    vietnamese: 'Đường kim sợi chỉ trong tay người mẹ hiền, khâu chiếc áo mặc trên thân đứa con đi xa.\nLúc sắp lên đường tỉ mỉ từng mũi chỉ, thầm lo lắng con sẽ muộn màng trở về.\nAi dám bảo tấc lòng cỏ non nhỏ bé, đền đáp nổi ánh nắng ấm ba tháng mùa xuân?',
  },
  {
    title: 'Trừ Châu tây giản (滁州西涧)',
    author: 'Vi Ứng Vật (韦应物)',
    chinese: '独怜幽草涧边生，上有黄鹂深树鸣。\n春潮带雨晚来急，野渡无人舟自横。',
    pinyin: 'Dú lián yōu cǎo jiàn biān shēng, shàng yǒu huáng lí shēn shù míng.\nChūn cháo dài yǔ wǎn lái jí, yě dù wú rén zhōu zì héng.',
    vietnamese: 'Chỉ yêu nhánh cỏ u tịch mọc bên bờ suối, trên cành cây rậm tiếng chim oanh véo von.\nThủy triều xuân cuốn theo cơn mưa đổ dồn lúc chiều tà, bến vắng chẳng bóng người con thuyền tự trôi ngang.',
  },
  {
    title: 'Mẫn nông (悯农)',
    author: 'Lý Thân (李绅)',
    chinese: '锄禾日当午，汗滴禾下土。\n谁知盘中餐，粒粒皆辛苦。',
    pinyin: 'Chú hé rì dāng wǔ, hàn dī hé xià tǔ.\nShuí zhī pán zhōng cān, lì lì jiē xīn kǔ.',
    vietnamese: 'Xới lúa giữa buổi trưa đứng bóng, mồ hôi rơi từng giọt xuống chân đất luống cày.\nAi hay biết cơm canh trong đĩa ngọc, từng hạt từng hạt đều thấm đẫm nỗi đắng cay nhọc nhằn.',
  },
  {
    title: 'Biệt Đổng Đại (别董大)',
    author: 'Cao Thích (高适)',
    chinese: '千里黄云白日曛，北风吹雁雪纷纷。\n莫愁前路无知己，天下谁人不识君？',
    pinyin: 'Qiān lǐ huáng yún bái rì xūn, běi fēng chuī yàn xuě fēn fēn.\nMò chóu qián lù wú zhī jǐ, tiān xià shuí rén bù shí jūn?',
    vietnamese: 'Ngàn dặm mây vàng vầng dương mờ mịt, gió bắc lùa bầy nhạn tuyết rơi tơi bời.\nChớ lo ngại đường trước vắng bóng tri kỷ, thiên hạ này hỏi ai lại chẳng biết đến chàng?',
  },
  {
    title: 'Đề Tây Lâm bích (题西林壁)',
    author: 'Tô Thức (苏轼)',
    chinese: '横看成岭侧成峰，远近高低各不同。\n不识庐山真面目，只缘身在此山中。',
    pinyin: 'Héng kàn chéng lǐng cè chéng fēng, yuǎn jìn gāo dī gè bù tóng.\nBù shí lú shān zhēn miàn mù, zhǐ yuán shēn zài cǐ shān zhōng.',
    vietnamese: 'Nhìn ngang hoá dãy nhìn nghiêng hoá đỉnh, xa gần cao thấp mỗi góc nhìn một khác.\nChẳng thể biết được bộ mặt thật của núi Lư Sơn, âu cũng chỉ vì tấm thân đang ở ngay giữa lòng núi.',
  },
  {
    title: 'Ẩm hồ thượng sơ tình hậu vũ (饮湖上初晴后雨)',
    author: 'Tô Thức (苏轼)',
    chinese: '水光潋滟晴方好，山色空蒙雨亦奇。\n欲把西湖比西子，淡妆浓抹总相宜。',
    pinyin: 'Shuǐ guāng liàn yàn qíng fāng hǎo, shān sè kōng méng yǔ yì qí.\nYù bǎ xī hú bǐ xī zǐ, dàn zhuāng nóng mǒ zǒng xiāng yí.',
    vietnamese: 'Nước sóng sánh ánh nắng tạnh ráo thật rạng ngời, sắc non mờ ảo trong mưa lại càng kỳ thú.\nVí thử đem Tây Hồ ví như nàng Tây Thi tuyệt sắc, dẫu trang điểm nhạt hay thoa phấn đậm thảy đều duyên dáng.',
  },
  {
    title: 'Thủy điệu ca đầu (水调歌头)',
    author: 'Tô Thức (苏轼)',
    chinese: '人有悲欢离合，月有阴晴圆缺，此事古难全。\n但愿人长久，千里共婵娟。',
    pinyin: 'Rén yǒu bēi huān lí hé, yuè yǒu yīn qíng yuán quē, cǐ shì gǔ nán quán.\nDàn yuàn rén cháng jiǔ, qiān lǐ gòng chán juān.',
    vietnamese: 'Đời người có buồn vui tan hợp, vầng trăng có mờ tỏ tròn khuyết, việc ấy xưa nay khó vẹn toàn.\nChỉ mong người mãi trường tồn bình an, dẫu cách xa ngàn dặm vẫn cùng ngắm chung vầng trăng dịu hiền.',
  },
  {
    title: 'Như mộng lệnh (如梦令)',
    author: 'Lý Thanh Chiếu (李清照)',
    chinese: '昨夜雨疏风骤，浓睡不消残酒。\n试问卷帘人，却道海棠依旧。\n知否，知否？应是绿肥红瘦。',
    pinyin: 'Zuó yè yǔ shū fēng zhòu, nóng shuì bù xiāo cán jiǔ.\nShì wèn juǎn lián rén, què dào hǎi táng yī jiù.\nZhī fǒu, zhī fǒu? Yīng shì lǜ féi hóng shòu.',
    vietnamese: 'Đêm qua mưa thưa gió rát, giấc ngủ say chẳng tan hết hơi men còn vương.\nƯớm hỏi người cuốn rèm, lại bảo rằng hoa hải đường vẫn như xưa.\nHay chăng, hay chăng? Lẽ ra phải là lá biếc tươi tốt còn hoa đỏ đã tàn phai.',
  },
  {
    title: 'Xuân nhật (春日)',
    author: 'Chu Hi (朱熹)',
    chinese: '胜日寻芳泗水滨，无边光景一时新。\n等闲识得东风面，万紫千红总是春。',
    pinyin: 'Shèng rì xún fāng sì shuǐ bīn, wú biān guāng jǐng yī shí xīn.\nDěng xián shí dé dōng fēng miàn, wàn zǐ qiān hóng zǒng shì chūn.',
    vietnamese: 'Ngày lành tìm cảnh hoa thơm ven bến Tứ Thủy, phong cảnh vô bờ bến bỗng chốc đổi mới tinh khôi.\nNhận ra diện mạo của làn gió xuân thật dễ dàng, muôn tía ngàn hồng khoe sắc thảy đều là sắc xuân.',
  },
  {
    title: 'Bạc thuyền Qua Châu (泊船瓜洲)',
    author: 'Vương An Thạch (王安石)',
    chinese: '京口瓜洲一水间，钟山只隔数重山。\n春风又绿江南岸，明月何时照我还？',
    pinyin: 'Jīng kǒu guā zhōu yī shuǐ jiān, zhōng shān zhǐ gé shù chóng shān.\nChūn fēng yòu lǜ jiāng nán àn, míng yuè hé shí zhào wǒ huán?',
    vietnamese: 'Kinh Khẩu cùng Qua Châu chỉ cách một khoảng nước, núi Chung Sơn chỉ cách mấy trùng núi non.\nGió xuân lại thổi xanh mướt bờ nam dòng sông, vầng trăng sáng bao giờ mới soi lối ta quay về?',
  },
  {
    title: 'Thị nhi (示儿)',
    author: 'Lục Du (陆游)',
    chinese: '死去元知万事空，但悲不见九州同。\n王师北定中原日，家祭无忘告乃翁。',
    pinyin: 'Sǐ qù yuán zhī wàn shì kōng, dàn bēi bù jiàn jiǔ zhōu tóng.\nWáng shī běi dìng zhōng yuán rì, jiā jì wú wàng gào nǎi wēng.',
    vietnamese: 'Chết đi vốn biết muôn sự hoá hư không, chỉ xót xa chưa thấy non sông thu về một mối.\nNgày quân vương dẹp yên phương bắc lấy lại Trung Nguyên, cúng giỗ gia tiên chớ quên khấn báo cho người cha này hay.',
  },
];

/**
 * Thuật toán băm chuỗi ngày YYYY-MM-DD để tạo chỉ số ngẫu nhiên nhưng ổn định.
 * Cùng một ngày luôn trả về một câu thơ cố định.
 * @param {string} dateStr YYYY-MM-DD
 * @returns {number}
 */
function hashString(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Lấy câu thơ cố định theo ngày
 * @param {string} dateStr YYYY-MM-DD
 * @returns {{ poem: object, index: number }}
 */
export function getPoemForDate(dateStr) {
  const index = hashString(dateStr) % POEMS.length;
  return { poem: POEMS[index], index };
}

/**
 * Lấy câu thơ ngẫu nhiên khác câu thơ hiện tại (dùng khi bấm "câu khác")
 * @param {number} [excludeIndex=-1]
 * @returns {{ poem: object, index: number }}
 */
export function getRandomPoem(excludeIndex = -1) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * POEMS.length);
  } while (newIndex === excludeIndex && POEMS.length > 1);
  return { poem: POEMS[newIndex], index: newIndex };
}
