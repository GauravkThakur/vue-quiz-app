const key = import.meta.env.VITE_ENCRYPTION_KEY;
const iv = import.meta.env.VITE_ENCRYPTION_IV;
const keyMatch = key.match(/.{1,2}/g) || [];
const ivMatch = iv.match(/.{1,2}/g) || [];
const keyBuffer = new Uint8Array(keyMatch.map((byte: string) => parseInt(byte, 16)));
const ivBuffer = new Uint8Array(ivMatch.map((byte: string) => parseInt(byte, 16)));

export const decryptAnswer = async (encryptedText: string) => {
  const encryptedBuffer = new Uint8Array(
    (encryptedText.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16))
  );

  const cryptoKey = await crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC' }, false, [
    'decrypt'
  ]);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: ivBuffer },
    cryptoKey,
    encryptedBuffer
  );
  const decoder = new TextDecoder('utf8');
  return decoder.decode(decryptedBuffer);
};
