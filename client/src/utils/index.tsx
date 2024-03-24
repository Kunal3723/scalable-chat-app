export function randomId(): string {
    // Generate a random number and convert it to base 36 (numbers + letters)
    const randomString = Math.random().toString(36).substring(2);
    // Get current timestamp in milliseconds and convert it to base 36
    const timestampString = Date.now().toString(36);
    // Concatenate random string and timestamp string
    const id = randomString + timestampString;
    return id;
  }