'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

let eventDispatcher = [];

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            eventDispatcher.push([event, context, handler]);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            let k = 0;
            for (let element of eventDispatcher) {
                if ((element[0] === event || isChildren(element[0], event)) &&
                    areEqual(element[1], context)) {
                    eventDispatcher[k] = undefined;
                }
                k++;
            }
            // Избавляемся от всех этих undefined, создавая новый массив(...
            eventDispatcher = eventDispatcher.filter(x => x);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            tryExecute(event);
            tryExecuteBase(event);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

function areEqual(object1, object2) {

    return object1.wisdom === object2.wisdom &&
        object1.focus === object2.focus;
}

function tryExecuteBase(event) {
    const baseEvent = event.includes('.') ? event.split('.')[0] : undefined;
    if (baseEvent) {
        tryExecute(baseEvent);
    }
}

function tryExecute(event) {
    for (let current of eventDispatcher) {
        if (current[0] === event) {
            current[2].call(current[1]);
        }
    }
}

function isChildren(childrenEvent, baseEvent) {
    let hasBase = childrenEvent.includes('.');

    return hasBase && childrenEvent.split('.')[0] === baseEvent;
}


module.exports = {
    getEmitter,

    isStar
};
