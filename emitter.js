'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

let eventDispatcher = {};

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
            if (eventDispatcher[event]) {
                eventDispatcher[event].push([context, handler]);
            } else {
                eventDispatcher[event] = [];
                eventDispatcher[event].push([context, handler]);
            }


            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (let key of Object.keys(eventDispatcher)) {
                if (key === event || isChildren(key, event)) {
                    eventDispatcher[key] = getRidOfContext(eventDispatcher[key], context);
                }
            }

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
    for (let key of Object.keys(eventDispatcher)) {
        const keyValues = eventDispatcher[key];
        if (key === event) {
            executeAllFrom(keyValues);
        }
    }
}

function isChildren(childrenEvent, baseEvent) {
    let hasBase = childrenEvent.includes('.');

    return hasBase && childrenEvent.split('.')[0] === baseEvent;
}

function executeAllFrom(array) {
    for (let each of Object.values(array)) {
        each[1].call(each[0]);
    }
}

function getRidOfContext(map, context) {
    return map.filter(x => {
        return !areEqual(x[0], context);
    });
}

module.exports = {
    getEmitter,

    isStar
};
