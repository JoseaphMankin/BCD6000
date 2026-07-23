function DebugCache() {
  LoadCaches();
  Logger.log("Cache loaded: " + (_cacheLoaded ? "YES" : "NO"));
  Logger.log("KeyCards count: " + (_keyCardsCache ? _keyCardsCache.length : "null"));
  Logger.log("Inventory rows: " + (_inventoryCache ? _inventoryCache.length : "null"));
}
