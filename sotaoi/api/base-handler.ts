import { Artifact } from '@sotaoi/omni/artifacts';
import { PermissionCheck } from '@sotaoi/api/contracts';
import { permissions } from '@sotaoi/api/permissions';
import { ResponseToolkit } from '@hapi/hapi';

abstract class BaseHandler {
  public handler: ResponseToolkit;

  constructor(handler: ResponseToolkit) {
    this.handler = handler;
  }

  public requireArtifact(artifact: null | Artifact): PermissionCheck {
    return permissions().install(artifact);
  }
}

export { BaseHandler };
