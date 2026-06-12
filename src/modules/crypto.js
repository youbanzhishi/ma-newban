/**
 * Crypto Utils - 加密/解密工具
 */

// 用户密码
let userPassword = '123';

// 设置用户密码
export function setUserPassword(password) {
  userPassword = password;
}

// 获取用户密码
export function getUserPassword() {
  return userPassword;
}

// 派生密钥
function deriveKey(password) {
  return CryptoJS.SHA256(password).toString();
}

// 加密数据
export function encryptData(data) {
  return CryptoJS.AES.encrypt(data, deriveKey(userPassword)).toString();
}

// 解密数据
export function decryptData(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, deriveKey(userPassword));
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
}

// 判断是否为加密数据
export function isEncryptedData(content) {
  // 加密数据通常具有特定的模式
  if (content.includes('U2FsdGVkX1')) {
    return true;
  }
  
  // 检查是否是有效的JSON
  try {
    JSON.parse(content);
    return false;
  } catch (e) {
    return true;
  }
}

// 加载加密文件
export function loadEncryptedFileContent(password) {
  const encryptedData = loadEncryptedFiles();
  if (encryptedData && password) {
    const tempPassword = userPassword;
    userPassword = password;
    const result = decryptData(encryptedData);
    userPassword = tempPassword;
    return result;
  }
  return null;
}
