export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const stripBase64Prefix = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
};

export const getMimeTypeFromBase64 = (base64: string): string => {
  const match = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
  return match ? match[1] : 'image/jpeg';
};