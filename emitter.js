'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

function getAllEvents(event) {
    let events = [event];
    if (!event.includes('.')) {
        return events;
    }
    let current = event;
    let lastDot = current.lastIndexOf('.');
    while (lastDot > -1) {
        current = current.slice(0, lastDot);
        events.push(current);
        lastDot = current.lastIndexOf('.');
    }

    return events;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let eventDispatcher = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!eventDispatcher.has(event)) {
                eventDispatcher.set(event, []);
            }
            const onPerson = { context: context, handler: handler };
            eventDispatcher.get(event).push(onPerson);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Array.from(eventDispatcher.keys())
                .filter(x => x.startsWith(event + '.') || x === event)
                .forEach(filtered => {
                    eventDispatcher.set(filtered, eventDispatcher
                        .get(filtered)
                        .filter(x => x.context !== context));
                });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const allEvents = getAllEvents(event);
            for (const i of allEvents) {
                if (eventDispatcher.has(i)) {
                    eventDispatcher.get(i).forEach(x => {
                        x.handler.call(x.context);
                    });
                }
            }

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

module.exports = {
    getEmitter,

    isStar
};
