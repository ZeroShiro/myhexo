// source/js/custom-footer.js
// 1
function changeFooterContent() {
  // 1. 选中页脚的 P 标签
  var target = document.querySelector(".level > .level-start > p");

  // 2. 检查元素是否存在
  if (target) {
      // 关键在这里：href="mailto:你的邮箱"
        // var emailLink = '<a href="mailto:1311588796@qq.com">给我发邮件</a>';
        
        // 拼接内容： © 2024 名字 | 给我发邮件
        target.innerHTML = '© 2025 ZeroShiro | Thanks for reading.';
      // 修改样式
      // target.style.color = 'red';
  }
}

// 微信图标链接带 target="_blank"，javascript: 地址在新窗口里不会执行
function bindWechatLink() {
  document.querySelectorAll("i.fa-weixin").forEach(function (icon) {
    var link = icon.closest("a");
    if (!link || link.dataset.wechatBound) {
      return;
    }
    link.dataset.wechatBound = "1";
    link.removeAttribute("target");
    link.addEventListener("click", function (event) {
      event.preventDefault();
      window.alert("微信号：v123256");
    });
  });
}

function onPageReady() {
  changeFooterContent();
  bindWechatLink();
}

// 4. 监听事件 (兼容 PJAX)
document.addEventListener("DOMContentLoaded", onPageReady);
document.addEventListener("pjax:complete", onPageReady);