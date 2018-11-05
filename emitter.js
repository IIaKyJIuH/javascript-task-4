'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

let eventDispatcher = new Map();

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
            if (!eventDispatcher.has(event)) {
                eventDispatcher.set(event, []);
            }
            const onEvent = { person: context, action: handler };
            let eventArray = eventDispatcher.get(event);
            eventArray.push(onEvent);

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
                .filter(x => x.includes(event))
                .forEach(filtered =>{
                    eventDispatcher.set(filtered, eventDispatcher
                        .get(filtered)
                        .filter(x => x.person !== context));
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
            for (const each of allEvents) {
                if (eventDispatcher.has(each)) {
                    eventDispatcher.get(each).forEach(x => {
                        x.action.call(x.person);
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

function getAllEvents(event) {
    const events = [event];
    if (!event.includes('.')) {
        return events;
    }
    events.push(event.split('.')[0]);

    return events;
}

module.exports = {
    getEmitter,

    isStar
};
