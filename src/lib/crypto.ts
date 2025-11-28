// Crypto utilities for encryption/decryption

/**
 * Gera um token mágico único
 */
export function generateMagicToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Gera um token de administrador único
 */
export function generateAdminToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Criptografa dados usando uma chave secreta
 */
export async function encryptData(data: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Deriva uma chave a partir da secretKey
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    dataBuffer
  );
  
  // Combina salt + iv + dados criptografados
  const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
  resultBuffer.set(salt, 0);
  resultBuffer.set(iv, salt.length);
  resultBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
  
  // Converte para base64
  return btoa(String.fromCharCode(...resultBuffer));
}

/**
 * Descriptografa dados usando uma chave secreta
 */
export async function decryptData(encryptedData: string, secretKey: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Decodifica de base64
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extrai salt, iv e dados criptografados
    const salt = encryptedBuffer.slice(0, 16);
    const iv = encryptedBuffer.slice(16, 28);
    const data = encryptedBuffer.slice(28);
    
    // Deriva a chave
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Descriptografa
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    throw new Error('Token inválido ou corrompido');
  }
}

/**
 * Realiza o sorteio de Amigo Oculto
 * Garante que ninguém tire a si mesmo
 */
export function performDraw(participants: string[]): Map<string, string> {
  if (participants.length < 3) {
    throw new Error('É necessário pelo menos 3 participantes');
  }
  
  const givers = [...participants];
  const receivers = [...participants];
  const result = new Map<string, string>();
  
  // Algoritmo de embaralhamento com validação
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    result.clear();
    const availableReceivers = [...receivers];
    let valid = true;
    
    for (const giver of givers) {
      // Filtra para não tirar a si mesmo
      const validReceivers = availableReceivers.filter(r => r !== giver);
      
      if (validReceivers.length === 0) {
        valid = false;
        break;
      }
      
      // Escolhe aleatoriamente
      const randomIndex = Math.floor(Math.random() * validReceivers.length);
      const receiver = validReceivers[randomIndex];
      
      result.set(giver, receiver);
      availableReceivers.splice(availableReceivers.indexOf(receiver), 1);
    }
    
    if (valid) {
      return result;
    }
    
    attempts++;
  }
  
  throw new Error('Não foi possível realizar o sorteio. Tente novamente.');
}
