"""empty message

Revision ID: 763e495eddfa
Revises: d3a65b1b585f
Create Date: 2024-10-14 21:05:23.938437

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '763e495eddfa'
down_revision = 'd3a65b1b585f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('pending_verification', schema=None) as batch_op:
        batch_op.add_column(sa.Column('gender', sa.String(length=10), nullable=False))
        batch_op.add_column(sa.Column('dob', sa.Date(), nullable=False))
        batch_op.add_column(sa.Column('phone', sa.String(length=15), nullable=False))
        batch_op.add_column(sa.Column('location', sa.String(length=100), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('pending_verification', schema=None) as batch_op:
        batch_op.drop_column('location')
        batch_op.drop_column('phone')
        batch_op.drop_column('dob')
        batch_op.drop_column('gender')

    # ### end Alembic commands ###