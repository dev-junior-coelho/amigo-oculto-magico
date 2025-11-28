import { describe, it, expect } from 'vitest';
import { performDraw, encryptData, decryptData, generateMagicToken } from './crypto';

describe('Crypto Lib', () => {
  describe('performDraw', () => {
    it('should draw correctly for 3 participants', () => {
      const participants = ['Alice', 'Bob', 'Charlie'];
      const result = performDraw(participants);

      expect(result.size).toBe(3);
      expect(result.get('Alice')).not.toBe('Alice');
      expect(result.get('Bob')).not.toBe('Bob');
      expect(result.get('Charlie')).not.toBe('Charlie');
      
      const receivers = Array.from(result.values());
      expect(receivers).toContain('Alice');
      expect(receivers).toContain('Bob');
      expect(receivers).toContain('Charlie');
    });

    it('should throw error for less than 3 participants', () => {
      expect(() => performDraw(['Alice', 'Bob'])).toThrow();
    });

    it('should work for larger groups', () => {
      const participants = Array.from({ length: 20 }, (_, i) => `User${i}`);
      const result = performDraw(participants);
      
      expect(result.size).toBe(20);
      participants.forEach(p => {
        expect(result.get(p)).not.toBe(p);
      });
    });
  });

  describe('Encryption', () => {
    it('should encrypt and decrypt correctly', async () => {
      const data = 'Secret Santa Target';
      const token = generateMagicToken();
      
      const encrypted = await encryptData(data, token);
      expect(encrypted).not.toBe(data);
      
      const decrypted = await decryptData(encrypted, token);
      expect(decrypted).toBe(data);
    });

    it('should fail with wrong token', async () => {
      const data = 'Secret Santa Target';
      const token = generateMagicToken();
      const wrongToken = generateMagicToken();
      
      const encrypted = await encryptData(data, token);
      
      await expect(decryptData(encrypted, wrongToken)).rejects.toThrow();
    });
  });
});
