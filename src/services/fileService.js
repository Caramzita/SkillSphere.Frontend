export function handleFileChange(event, callback) {
    const file = event.target.files[0];
  
    if (!file) {
      callback(null, null);
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(file, e.target.result);
    };
    reader.readAsDataURL(file);
  }
  