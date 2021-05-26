import { resolve } from './_resolve';
import { sanitizeValue } from './_util';

/**
 * Metadata associated with this object.
 */
export interface ApiObjectMetadata {
  /**
   * The unique, namespace-global, name of this object inside the Kubernetes
   * cluster.
   *
   * Normally, you shouldn't specify names for objects and let the CDK generate
   * a name for you that is application-unique. The names CDK generates are
   * composed from the construct path components, separated by dots and a suffix
   * that is based on a hash of the entire path, to ensure uniqueness.
   *
   * You can supply custom name allocation logic by overriding the
   * `chart.generateObjectName` method.
   *
   * If you use an explicit name here, bear in mind that this reduces the
   * composability of your construct because it won't be possible to include
   * more than one instance in any app. Therefore it is highly recommended to
   * leave this unspecified.
   *
   * @default - an app-unique name generated by the chart
   */
  readonly name?: string;

  /**
   * Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be
   * preserved when modifying objects.
   *
   * @see http://kubernetes.io/docs/user-guide/annotations
   * @default - No annotations.
   */
  readonly annotations?: { [key: string]: string };

  /**
   * Map of string keys and values that can be used to organize and categorize (scope and select) objects.
   * May match selectors of replication controllers and services.
   *
   * @see http://kubernetes.io/docs/user-guide/labels
   * @default - No labels.
   */
  readonly labels?: { [key: string]: string };

  /**
   * Namespace defines the space within each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation.
   * Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty. Must be a DNS_LABEL. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/namespaces
   *
   * @default undefined (will be assigned to the 'default' namespace)
   */
  readonly namespace?: string;

  /**
   * Additional metadata attributes.
   */
  readonly [key: string]: any;
}

/**
 * Object metadata.
 */
export class ApiObjectMetadataDefinition {
  /**
   * The name of the API object.
   *
   * If a name is specified in `metadata.name` this will be the name returned.
   * Otherwise, a name will be generated by calling
   * `Chart.of(this).generatedObjectName(this)`, which by default uses the
   * construct path to generate a DNS-compatible name for the resource.
   */
  public readonly name?: string;

  /**
   * The object's namespace.
   */
  public readonly namespace?: string;

  /**
   * Labels associated with this object.
   */
  private readonly labels: { [key: string]: string };

  /**
   * Annotations associated with this object.
   */
  private readonly annotations: { [key: string]: string };

  /**
   * Additional metadata attributes passed through `options`.
   */
  private readonly _additionalAttributes: { [key: string]: any };

  constructor(options: ApiObjectMetadata = { }) {
    this.name = options.name;
    this.labels = options.labels ?? { };
    this.annotations = options.annotations ?? { };
    this.namespace = options.namespace;
    this._additionalAttributes = options ?? { };
  }

  /**
   * Add a label.
   *
   * @param key - The key.
   * @param value - The value.
   */
  public addLabel(key: string, value: string) {
    this.labels[key] = value;
  }

  /**
   * @returns a value of a label or undefined
   * @param key the label
   */
  public getLabel(key: string): string | undefined {
    return this.labels[key];
  }

  /**
   * Add an annotation.
   *
   * @param key - The key.
   * @param value - The value.
   */
  public addAnnotation(key: string, value: string) {
    this.annotations[key] = value;
  }

  /**
   * Adds an arbitrary key/value to the object metadata.
   * @param key Metadata key
   * @param value Metadata value
   */
  public add(key: string, value: any) {
    this._additionalAttributes[key] = value;
  }

  /**
   * Synthesizes a k8s ObjectMeta for this metadata set.
   */
  public toJson() {
    const sanitize = (x: any) => sanitizeValue(x, { filterEmptyArrays: true, filterEmptyObjects: true });
    return sanitize(resolve({
      ...this._additionalAttributes,
      name: this.name,
      namespace: this.namespace,
      annotations: this.annotations,
      labels: this.labels,
    }));
  }
}
