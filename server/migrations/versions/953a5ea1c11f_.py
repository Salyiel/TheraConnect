"""empty message

Revision ID: 953a5ea1c11f
Revises: 7c1ecf3de806
Create Date: 2024-10-18 21:04:44.096588

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '953a5ea1c11f'
down_revision = '7c1ecf3de806'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('email_change_verification', schema=None) as batch_op:
        batch_op.drop_constraint('uq_used_email', type_='unique')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('email_change_verification', schema=None) as batch_op:
        batch_op.create_unique_constraint('uq_used_email', ['used_email'])

    # ### end Alembic commands ###