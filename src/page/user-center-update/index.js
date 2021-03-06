require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

let navSide = require('page/common/nav-side/index.js');
let _mm = require('util/mall.js');
let _user = require('service/user-service.js');
let templateIndex = require('./index.string');

//page逻辑部分
let page = {
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        //初始化左侧菜单
        navSide.init({
            name: 'user-center'
        });
        //加载用户信息
        this.loadUserInfo();
    },
    bindEvent: function () {
        let _this = this;
        //点击提交后按钮的动作
        $(document).on('click', '.btn-submit', function () {
            let userInfo = {
                    phone: $.trim($('#phone').val()),
                    email: $.trim($('#email').val()),
                    question: $.trim($('#question').val()),
                    answer: $.trim($('#answer').val()),
                },
                validateResult = _this.validateForm(userInfo);
            if (validateResult.status) {
                _user.updateUserInfo(userInfo, function (res, msg) {
                    _mm.successTips(msg);
                    window.location.href = './user-center.html'
                }, function (errMsg) {
                    _mm.errorTips(errMsg);
                });
            } else {
                _mm.errorTips(validateResult.msg);

            }
        });
    },
    loadUserInfo: function () {
        let userHtml = '';
        _user.getUserInfo(function (res) {
            userHtml = _mm.renderHtml(templateIndex, res);
            $('.panel-body').html(userHtml);
        }, function (errMsg) {
            _mm.errorTips(errMsg);
        })
    },
    validateForm: function (formData) {
        let result = {
            status: false,
            msg: ''
        };
        // 验证手机号
        if (!_mm.validate(formData.phone, 'phone')) {
            result.msg = '手机号格式不正确';
            return result;
        }
        // 验证邮箱格式
        if (!_mm.validate(formData.email, 'email')) {
            result.msg = '邮箱格式不正确';
            return result;
        }
        // 验证密码提示问题是否为空
        if (!_mm.validate(formData.question, 'require')) {
            result.msg = '密码提示问题不能为空';
            return result;
        }
        // 验证密码提示问题答案是否为空
        if (!_mm.validate(formData.answer, 'require')) {
            result.msg = '密码提示问题答案不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};

$(function () {
    page.init();
});