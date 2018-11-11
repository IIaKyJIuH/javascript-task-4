'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

function getAllEvents(event) {
    let events = [event];
    if (!event.includes('.')) {
        return events;
    }
    let current = event;
    let eventsArray = current.split('.');
    for (let i = 0; i < eventsArray.length - 1; i++) {
        current = eventsArray[0];
        events.push(current);
    }

    return events;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let eventDispatcher = new Map();
    function getRequiredPerson(event, context, handler) {
        return eventDispatcher
            .get(event)
            .filter(x => x.context === context && x.handler === handler)[0];
    }

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
            const onPerson = {
                context,
                handler,
                repetitions: 0,
                isActual: () => true
            };
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
                .filter(eventKey => eventKey.startsWith(event + '.') ||
                eventKey === event)
                .forEach(x => {
                    let filteredArray = eventDispatcher.get(x)
                        .filter(y => y.context !== context);
                    eventDispatcher.set(x, filteredArray);
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
            for (const nextEvent of allEvents) {
                if (eventDispatcher.has(nextEvent)) {
                    eventDispatcher.get(nextEvent).forEach(person => {
                        if (person.isActual(person.repetitions)) {
                            person.handler.call(person.context);
                        }
                        person.repetitions += 1;
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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times === 0) {
                this.on(event, context, handler);
            } else {
                this.on(event, context, handler);
                let obj = getRequiredPerson(event, context, handler);
                obj.isActual = (repetitions) => repetitions < times;
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency === 0) {
                this.on(event, context, handler);
            } else {
                this.on(event, context, handler);
                let obj = getRequiredPerson(event, context, handler);
                obj.isActual = (repetitions) => repetitions % frequency === 0;
            }

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
