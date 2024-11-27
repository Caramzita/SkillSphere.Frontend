export function handleError(errorResponse) {
  if (!errorResponse) {
    return { general: ["An unknown error occurred."] };
  }

  // Если ошибки приходят в формате массива [{ Field, Error }]
  if (Array.isArray(errorResponse.errors)) {
    return errorResponse.errors.reduce((acc, err) => {
      acc[err.Field.toLowerCase()] = err.Error;
      return acc;
    }, {});
  }

  // Если ошибки приходят в формате словаря { FieldName: ["Error message"] }
  if (errorResponse.errors && typeof errorResponse.errors === "object") {
    return Object.keys(errorResponse.errors).reduce((acc, field) => {
      acc[field.toLowerCase()] = errorResponse.errors[field][0]; // Берем первую ошибку для каждого поля
      return acc;
    }, {});
  }

  // Если ошибка в общем сообщении (например, { message: "Some error" })
  if (errorResponse.message) {
    return { general: [errorResponse.message] };
  }

  // Если ошибка в массиве строк
  if (Array.isArray(errorResponse)) {
    return { general: errorResponse };
  }

  // На случай неизвестного формата
  return { general: ["An unknown error occurred."] };
}
