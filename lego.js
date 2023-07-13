"use strict";

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

const AllMethods = [
    "and",
    "or",
    "filterIn",
    "sortBy",
    "select",
    "format",
    "limit",
];

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection, ...selectors) {
    const selection = JSON.parse(JSON.stringify(collection));
    return selectors
        .sort((a, b) => AllMethods.indexOf(a.name) - AllMethods.indexOf(b.name))
        .reduce((result, selector) => {
            return selector(result);
        }, selection);
};

/**
 * Выбор полей
 * @params {...String}
 */
exports.select = (...properties) =>
    function select(collection) {
        return collection.map((item) => {
            return properties
                .filter((property) => {
                    return item.hasOwnProperty(property);
                })
                .reduce((result, property) => {
                    result[property] = item[property];

                    return result;
                }, {});
        });
    };

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 */
exports.filterIn = (property, values) =>
    function filterIn(collection) {
        // console.info(property, values);

        return collection.filter((item) => values.includes(item[property]));
    };

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 */
exports.sortBy = (property, order) =>
    function sortBy(collection) {
        // console.info(property, order);

        return collection.sort((a, b) => {
            return order === "asc"
                ? a[property] - b[property]
                : b[property] - a[property];
        });
    };

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 */
exports.format = (property, formatter) =>
    function format(collection) {
        // console.info(property, formatter);

        return collection.map((item) =>
            Object.assign({}, item, { [property]: formatter(item[property]) })
        );
    };

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 */
exports.limit = (count) =>
    function limit(collection) {
        // console.info(count);

        return collection.slice(0, count);
    };

if (exports.isStar) {
    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = (...selectors) =>
        function or(collection) {
            return collection.filter((item) =>
                selectors.some((selector) => selector([item]).length > 0)
            );
        };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = (...selectors) =>
        function and(collection) {
            return collection.filter((item) =>
                selectors.every((selector) => selector([item]).length > 0)
            );
        };
}
