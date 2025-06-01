/**
 * Formats a time in seconds to a human-readable string (HH:MM:SS or MM:SS)
 * @param seconds - Time in seconds
 * @param showHours - Whether to show hours if less than 1 hour
 * @returns Formatted time string
 */
export function formatTime(seconds: number, showHours = false): string {
  if (!seconds && seconds !== 0) return "00:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  // Format with leading zeros
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = secs.toString().padStart(2, "0");
  
  // Always show hours if there are any or if showHours is true
  if (hours > 0 || showHours) {
    const formattedHours = hours.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  return `${formattedMinutes}:${formattedSeconds}`;
} 