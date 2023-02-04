module.exports.parse = async (raw, { axios, yaml, notify, console }, { name, url, interval, selected }) => {
  const obj = yaml.parse(raw);
  //常规配置
  obj['port'] = 7890;
  obj['socks-port'] = 7891;
  obj['allow-lan'] = true;
  obj['mode'] = "Rule";
  obj['log-level'] = "info";
  obj['external-controller'] = 9090;
  //dns相关的配置
  obj['dns'] = {
    "enable": true,
    "ipv6": true,
    "listen": "0.0.0.0:53",
    "use-hosts": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": ["*.lan"],
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    "nameserver": ["tls://dns.alidns.com:853", "tls://dot.pub:853"],
  };
  //获取所有节点名称
  const pnames = []
  for (let i in obj.proxies) {
    pnames.push(obj.proxies[i].name);
  }

  const hkServers=pnames.filter(p=>p.match(/港/));
  const twServers=pnames.filter(p=>p.match(/台/));
  const sgServes=pnames.filter(p=>p.match(/新加坡|狮城/));
  const usServes=pnames.filter(p=>p.match(/美国/));
  const krServes=pnames.filter(p=>p.match(/韩国/));
  const jpServes=pnames.filter(p=>p.match(/日本/));
  const hotServers=hkServers.concat(twServers).concat(sgServes).concat(usServes).concat(krServes).concat(jpServes);
  const coldServers=pnames.filter(p=>!hotServers.includes(p));
  //新的策略组
  const allProxyGroups = [];
  //建立策略组
  allProxyGroups.push({
    "name": "🚀 全球加速",
    "type": "select",
    "proxies": ["DIRECT", "REJECT","♻️ 自动选择","🇭🇰 香港节点","🇨🇳 台湾节点","🇸🇬 狮城节点","🇺🇸 美国节点","🇯🇵 日本节点","🇰🇷 韩国节点","🥶 冷门节点"].concat(hotServers),
  });
  allProxyGroups.push({
    "name": "🍎 苹果服务",
    "type": "select",
    "proxies": ["🚀 全球加速", "🎯 全球直连", "🛑 全球拦截", "♻️ 自动选择","🇭🇰 香港节点","🇨🇳 台湾节点","🇸🇬 狮城节点","🇺🇸 美国节点","🇯🇵 日本节点","🇰🇷 韩国节点","🥶 冷门节点"]
  });
  allProxyGroups.push({
    "name": "☁️ 微软服务",
    "type": "select",
    "proxies": ["🚀 全球加速", "🎯 全球直连", "🛑 全球拦截", "♻️ 自动选择","🇭🇰 香港节点","🇨🇳 台湾节点","🇸🇬 狮城节点","🇺🇸 美国节点","🇯🇵 日本节点","🇰🇷 韩国节点","🥶 冷门节点"]
  });
  allProxyGroups.push({
    "name": "📲 电报消息",
    "type": "select",
    "proxies": ["🚀 全球加速", "🎯 全球直连", "🛑 全球拦截", "♻️ 自动选择","🇭🇰 香港节点","🇨🇳 台湾节点","🇸🇬 狮城节点","🇺🇸 美国节点","🇯🇵 日本节点","🇰🇷 韩国节点","🥶 冷门节点"]
  });
  allProxyGroups.push({
    "name": "🔈 谷歌服务",
    "type": "select",
    "proxies": ["🚀 全球加速", "🎯 全球直连", "🛑 全球拦截", "♻️ 自动选择","🇭🇰 香港节点","🇨🇳 台湾节点","🇸🇬 狮城节点","🇺🇸 美国节点","🇯🇵 日本节点","🇰🇷 韩国节点","🥶 冷门节点"]
  });
  allProxyGroups.push({
    "name": "⬆️ 网速测试",
    "type": "select",
    "proxies": ["🚀 全球加速", "🎯 全球直连", "🛑 全球拦截", "♻️ 自动选择","🇭🇰 香港节点","🇨🇳 台湾节点","🇸🇬 狮城节点","🇺🇸 美国节点","🇯🇵 日本节点","🇰🇷 韩国节点","🥶 冷门节点"]
  });
  allProxyGroups.push({
    "name": "🐟 漏网之鱼",
    "type": "select",
    "proxies": ["🚀 全球加速", "🎯 全球直连", "🛑 全球拦截", "♻️ 自动选择","🇭🇰 香港节点","🇨🇳 台湾节点","🇸🇬 狮城节点","🇺🇸 美国节点","🇯🇵 日本节点","🇰🇷 韩国节点","🥶 冷门节点"]
  });
  allProxyGroups
  .push({
    "name": "🇭🇰 香港节点",
    "type": "url-test",
    "url": "http://www.gstatic.com/generate_204",
    "interval": 300,
    "proxies": hkServers,
  });
  allProxyGroups
  .push({
    "name": "🇨🇳 台湾节点",
    "type": "url-test",
    "url": "http://www.gstatic.com/generate_204",
    "interval": 300,
    "proxies": twServers,
  });
  allProxyGroups
  .push({
    "name": "🇸🇬 狮城节点",
    "type": "url-test",
    "url": "http://www.gstatic.com/generate_204",
    "interval": 300,
    "proxies": sgServes,
  });
  allProxyGroups
  .push({
    "name": "🇺🇸 美国节点",
    "type": "url-test",
    "url": "http://www.gstatic.com/generate_204",
    "interval": 300,
    "proxies": usServes,
  });
  allProxyGroups
  .push({
    "name": "🇯🇵 日本节点",
    "type": "url-test",
    "url": "http://www.gstatic.com/generate_204",
    "interval": 300,
    "proxies": jpServes,
  });
  allProxyGroups
  .push({
    "name": "🇰🇷 韩国节点",
    "type": "url-test",
    "url": "http://www.gstatic.com/generate_204",
    "interval": 300,
    "proxies": krServes,
  });
  allProxyGroups
  .push({
    "name": "🥶 冷门节点",
    "type": "url-test",
    "url": "http://www.gstatic.com/generate_204",
    "interval": 300,
    "proxies": coldServers,
  });
  allProxyGroups
  .push({
    "name": "🎯 全球直连",
    "type": "select",
    "proxies": ["DIRECT", "REJECT"],
  });
allProxyGroups.push({
  "name": "🛑 全球拦截",
  "type": "select",
  "proxies": ["REJECT", "DIRECT","🚀 全球加速"]
});
  allProxyGroups.push({
    "name": "♻️ 自动选择",
    "type": "url-test",
    "url": "http://www.gstatic.com/generate_204",
    "interval": 300,
    "proxies": pnames
  });

  // 所有的rule-providers
  const allRuleProviders = {};
  //规则修正
  allRuleProviders.unbreak = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Direct/Direct.yaml",
    "path": "./ruleset/unbreak.yaml",
    "interval": 86400
  };
  //广告、隐私、劫持拦截
  allRuleProviders.reject = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising_Classical.yaml",
    "path": "./ruleset/reject.yaml",
    "interval": 86400
  };
  //本地局域网地址
  allRuleProviders.lan = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/Lan/Lan.yaml",
    "path": "./ruleset/lan.yaml",
    "interval": 86400
  };
  //中国热门网站
  allRuleProviders.chinaTop = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/China/China.yaml",
    "path": "./ruleset/chinaTop.yaml",
    "interval": 86400
  };
  //苹果服务
  allRuleProviders.apple = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/Apple/Apple.yaml",
    "path": "./ruleset/apple.yaml",
    "interval": 86400
  };
  //谷歌服务
  allRuleProviders.google = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/Google/Google.yaml",
    "path": "./ruleset/google.yaml",
    "interval": 86400
  };
  //Youtube
  allRuleProviders.youtube = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/YouTube/YouTube.yaml",
    "path": "./ruleset/youtube.yaml",
    "interval": 86400
  };
    //微软服务
  allRuleProviders.microSoft = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/Microsoft/Microsoft.yaml",
    "path": "./ruleset/microSoft.yaml",
    "interval": 86400
  };
  //telegram
  allRuleProviders.telegram = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/Telegram/Telegram.yaml",
    "path": "./ruleset/telegram.yaml",
    "interval": 86400
  };
  //speed test
  allRuleProviders.speedTest = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/release/rule/Clash/Speedtest/Speedtest.yaml",
    "path": "./ruleset/speedTest.yaml",
    "interval": 86400
  };
  //国外热门网站
  allRuleProviders.globalTop = {
    "type": "http",
    "behavior": "classical",
    "url": "https://ghproxy.com/https://raw.githubusercontent.com/DivineEngine/Profiles/master/Clash/RuleSet/Global.yaml",
    "path": "./ruleset/globalTop.yaml",
    "interval": 86400
  };
  

  //所有的新规则
  const newRules = [];
  newRules.push("RULE-SET,lan,DIRECT");
  newRules.push("RULE-SET,unbreak,🎯 全球直连");
  newRules.push("RULE-SET,reject,🛑 全球拦截");
  newRules.push("RULE-SET,apple,🍎 苹果服务");
  newRules.push("RULE-SET,google,🔈 谷歌服务");
  newRules.push("RULE-SET,youtube,🔈 谷歌服务")
  newRules.push("RULE-SET,telegram,📲 电报消息");
  newRules.push("RULE-SET,microSoft,☁️ 微软服务");
  newRules.push("RULE-SET,speedTest,⬆️ 网速测试");
  newRules.push("RULE-SET,chinaTop,🎯 全球直连");
  newRules.push("RULE-SET,globalTop,🚀 全球加速");

  newRules.push("GEOIP,CN,🎯 全球直连");
  newRules.push("MATCH,🐟 漏网之鱼");


  //替换原有策略组
  obj["proxy-groups"] = allProxyGroups;
  //替换原有rule-provider
  obj["rule-providers"] = allRuleProviders;
  //替换原有规则
  obj['rules'] = newRules;
  return yaml.stringify(obj);
}