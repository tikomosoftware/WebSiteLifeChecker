import type { WebsiteTarget, HealthStatus } from './types';

/**
 * 指定されたWebサイトのヘルスチェックを実行する。
 * Python版の WebsiteHealthChecker._perform_http_request を移植。
 */
export async function checkWebsite(
  target: WebsiteTarget,
): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();
  const start = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      target.timeout * 1000,
    );

    const response = await fetch(target.url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'WebSiteLifeChecker/1.0' },
    });

    clearTimeout(timeoutId);
    const responseTime = (performance.now() - start) / 1000;

    const isHealthy = response.status === target.expectedStatus;

    return {
      targetName: target.name,
      isHealthy,
      responseTime,
      errorMessage: isHealthy
        ? null
        : `Unexpected status: ${response.status} (expected: ${target.expectedStatus})`,
      timestamp,
    };
  } catch (error) {
    const responseTime = (performance.now() - start) / 1000;
    let errorMessage = 'Unknown error';

    if (error instanceof DOMException && error.name === 'AbortError') {
      errorMessage = `Request timeout after ${target.timeout}s`;
    } else if (error instanceof TypeError) {
      // fetch の TypeError は通常ネットワークエラー
      errorMessage = `Connection error: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      targetName: target.name,
      isHealthy: false,
      responseTime,
      errorMessage,
      timestamp,
    };
  }
}

/**
 * 複数のWebサイトを並列でヘルスチェックする。
 * Python版の HealthCheckEngine.run_all_checks を移植。
 */
export async function checkAllWebsites(
  targets: WebsiteTarget[],
): Promise<HealthStatus[]> {
  const results = await Promise.allSettled(
    targets.map((target) => checkWebsite(target)),
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      targetName: targets[index].name,
      isHealthy: false,
      responseTime: 0,
      errorMessage: `Check failed: ${result.reason}`,
      timestamp: new Date().toISOString(),
    };
  });
}
