# idea-inspection-support

IntelliJ系IDEのインスペクションCLIのサポートツールです。

## インストール

```bash
npm install altus5/idea-inspection-support --save-dev
```

## インスペクション結果を変換

インスペクションを実行して出力されたXMLファイルを、見やすい形式に変換してレポート出力します。
検出するエラーレベルなどは、固定で実装されているので、任意のレベルに変更する場合は、コードを修正して使ってください。

```bash
npx idea-inspection-support report [output-path]
```

* output-path: インスペクションの結果ファイルが出力されたディレクトリ

## インスペクションのスコープを作成する

スコープはGUIで設定すればよいのだけど、IntelliJを使っていない人でも、スコープの設定を可能とするためのツール。  
jsonファイルにファイルパターンを記述することで、.ideaのディレクトリ配下にscopeの設定をXMLで保存します。

```bash
npx idea-inspection-support scope [project-path] [scope-name] [file-pattern-json]
```

* project-path: プロジェクトのパス（.ideaディレクトリのあるディレクトリ）
* scope-name: scope名
* file-pattern-json: ファイルパターンを記述したjsonファイル

(jsonファイルの例)
```json
[
  "controllers/*.php",
  "models/*.php",
  "views/*.php",
  "common/*.php"
]
```
