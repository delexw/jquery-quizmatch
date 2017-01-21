(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    "use strict";

    var els;

    $.fn.aylquizmatch = function (options) {
        var settings = $.extend(true, {}, $.fn.aylquizmatch.default.options, options);
        //define private settings for internal use that are not exposed
        settings._privates = {
            leftContainer: $('<div class="left"></div>'),
            rightContainer: $('<div class="right"></div>'),
            rightInnerContainer: $('<div class="rightInner"></div>'),
            itemLeftKeyPrefix: 'aylquizmatch_item_left_',
            itemRightKeyPrefix: 'aylquizmatch_item_right_'
        };

        //related data initialization
        els = $(this);
        $.each(settings.data, function (i, d) {
            settings.action.status.cur[d.rightItem.key] = {
                containerId: null
            };
            settings.action.status.pre[d.rightItem.key] = {
                containerId: null
            };
        });

        if (typeof options === 'string') {
            return _utilities[options](settings);
        } else {
            els.data('_matchData', settings.data);
        };

        return this.each(function (i, o) {
            var el = $(o);
            settings._privates.rightContainer.append(settings._privates.rightInnerContainer);
            el.append(settings._privates.leftContainer);
            el.append(settings._privates.rightContainer);

            //call functions or initiate html elements;
            if (settings.template.enable) {
                $.fn.aylquizmatch.default.utilities.loadTemplates(el, settings);
            }
        });
    }
    /* defualt */
    $.fn.aylquizmatch.default = {
        options: {
            template: {
                enable: true,
                leftItem: '../templates/{0}/question.html',
                rightItem: '../templates/{0}/answer.html'
            },
            data: [],
            action: {
                draggable: true,
                droppable: true,
                engine: 'html5',
                onbeforedrop: null,
                onafterdrop: null,
                status: {
                    track: true,
                    pre: {},
                    cur: {}
                }
            },
            type: 'default',
            animation: {
                enable: false,
                speed: 'fast',
                /* same values as those jQuery supports */
            }
        },
        utilities: {
            loadTemplates: function name(element, options) {
                if (typeof $.fn.loadTemplate === 'function') {
                    //make a flatted data with the original data
                    var flatDatal = [],
                        flatDataR = [];
                    $.each(options.data, function (i, d) {
                        flatDatal.push({
                            leftItem_label: d.leftItem.label,
                            leftItem_key: options._privates.itemLeftKeyPrefix + d.leftItem.key,
                            leftItem_refRight: d.leftItem.refRight,
                            leftItem_mapping_key: options._privates.itemLeftKeyPrefix + 'mapping_' + d.leftItem.key,
                            key: d.leftItem.key
                        });
                        flatDataR.push({
                            rightItem_label: d.rightItem.label,
                            rightItem_key: options._privates.itemRightKeyPrefix + d.rightItem.key,
                            key: d.rightItem.key
                        })
                    });
                    var leftItemPath = options.template.leftItem.replace(/\{0\}/g, options.type);
                    var rightItemPath = options.template.rightItem.replace(/\{0\}/g, options.type);
                    var leftItems = options._privates.leftContainer.loadTemplate(leftItemPath, flatDatal, {
                        isFile: true,
                        append: true,
                        success: function () {
                            leftItems.children().each(function (i, rl) {
                                options._privates.moveDirection = 'RL';
                                $.fn.aylquizmatch.droppable($(rl).find('.mappingArea'), options);
                            })
                        }
                    });
                    var rightItems = options._privates.rightInnerContainer.loadTemplate(rightItemPath, flatDataR, {
                        isFile: true,
                        append: true,
                        success: function () {
                            /**
                             * try to enable drag
                             */
                            rightItems.children().each(function (i, rl) {
                                $.fn.aylquizmatch.draggable($(rl), options);
                            });

                            options._privates.moveDirection = 'LR';
                            $.fn.aylquizmatch.droppable(rightItems, options);
                        }
                    });



                } else {
                    console.error('can not find template engine in context.');
                }
            }
        }
    };

    /**
     * define animation for draggable element
     */
    $.fn.aylquizmatch.animation = function (ItemElement, options) {}

    /**
     * Bind draggable event
     */
    $.fn.aylquizmatch.draggable = function name(itemElement, options) {
        if (options.action.draggable) {
            switch (options.action.engine) {
                case 'html5':
                    return _enalbeHTML5Draggable(itemElement, options);
            }
        }
    }
    /**
     * Bind droppable event
     */
    $.fn.aylquizmatch.droppable = function name(itemElement, options) {
        if (options.action.droppable) {
            switch (options.action.engine) {
                case 'html5':
                    return _enalbeHTML5Droppable(itemElement, options);
            }
        }
    }

    /**
     * drag enable in HTML5 drag
     */
    function _enalbeHTML5Draggable(itemElement, options) {
        return itemElement.attr('draggable', true).on('dragstart.aylquizmatch', function (e) {
            //have to use MIME type as the key in order to work in IE....
            e.originalEvent.dataTransfer.setData('text', e.originalEvent.target.id);

        });

    }

    function _enalbeHTML5Droppable(itemElement, options) {

        return itemElement.attr({
            droppable: true,
            direction: options._privates.moveDirection
        }).on('drop.aylquizmatch', function (e) {
            e.originalEvent.preventDefault();

            _trackSystem.run(options, e, function (options, e) {
                var draggingObj = document.getElementById(e.originalEvent.dataTransfer.getData('text'));
                e.originalEvent.target.appendChild(draggingObj);
                if ($(e.originalEvent.target).attr('direction') === 'RL') {
                    var questionItem = $(e.originalEvent.target).prev();
                    _positionToggle(questionItem, 'absolute');

                    if ($(draggingObj).data('qId') !== undefined) {
                        _positionToggle($('#' + $(draggingObj).data('qId')), 'relative');
                    }
                    $(draggingObj).data('qId', questionItem.attr('id'));

                    $(e.originalEvent.target).attr('data-ref', $(draggingObj).data('key'));

                    var containerIndex = $(this).parent().index();
                    els.data('_matchData')[containerIndex].leftItem.refRight.push($(draggingObj).data('key'));

                } else {
                    _positionToggle($('#' + $(draggingObj).data('qId')), 'relative');
                    $(draggingObj).removeData('qId');
                    var containerIndex = $('#' + options.action.status.pre[$(draggingObj).data('key')].containerId).parent().index();
                    var refIndex = els.data('_matchData')[containerIndex].leftItem.refRight.toString().indexOf($(draggingObj).data('key'));
                    els.data('_matchData')[containerIndex].leftItem.refRight.splice(refIndex,1);
                }

                $('#' + options.action.status.pre[$(draggingObj).data('key')].containerId).attr('data-ref', '');
            });

        }).on('dragover.aylquizmatch', function (e) {
            e.originalEvent.preventDefault();
            if ($(this).children().length !== 0 && options._privates.moveDirection === 'RL') {
                $(this).removeAttr('droppable');
            } else {
                var draggingObj = document.getElementById(e.originalEvent.dataTransfer.getData('text'));
                //console.info($(draggingObj).parent().attr('id'));
            }

        }).on('dragleave.aylquizmatch', function (e) {
            $(this).attr({
                droppable: true
            });
        });
    }

    function _positionToggle(element, position) {
        return element.css({
            position: position
        });
    }

    /**
     * internal action track system
     * Record the latest container element where the dragging element was in ever and
     * the container element where the dragging element is in currently.
     */
    var _trackSystem = {
        _logPreStatus: function (containerId, draggableKey, options) {
            var pre = options.action.status.pre[draggableKey];
            pre.containerId = containerId;
        },
        _logCurStatus: function (containerId, draggableKey, options) {
            var cur = options.action.status.cur[draggableKey];
            cur.containerId = containerId;
        },
        _beforedrop: function (options, e) {
            if ($(e.originalEvent.target).attr('droppable')) {
                if (options.action.status.track) {
                    var draggingObj = document.getElementById(e.originalEvent.dataTransfer.getData('text'));
                    this._logPreStatus($(draggingObj).parent().attr('id'), $(draggingObj).data('key'), options);
                }
                if (typeof options.action.onbeforedrop === 'function') {
                    var r = options.action.onbeforedrop(options, e);
                    return r === undefined ? false : r;
                }
                return true;
            }
            return false
        },
        _afterdrop: function (options, e) {
            if (options.action.status.track) {
                var draggingObj = document.getElementById(e.originalEvent.dataTransfer.getData('text'));
                this._logCurStatus($(draggingObj).parent().attr('id'), $(draggingObj).data('key'), options);
            }
            if (typeof options.action.onafterdrop === 'function') {
                options.action.onafterdrop(options, e);
            }
        },
        run: function (options, e, callback) {
            if (this._beforedrop(options, e)) {
                callback.call(e.currentTarget, options, e);
                this._afterdrop(options, e);
            }
        }
    };

    var _utilities = {
        getData: function (options) {
            return els.data('_matchData');
        }
    }
}));